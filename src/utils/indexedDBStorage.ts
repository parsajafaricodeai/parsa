import React, { useState, useEffect } from 'react';
import { formatBytes } from './mediaUtils';

const DB_NAME = 'kanoon_montazer_media_v1';
const STORE_NAME = 'media_blobs';
const DB_VERSION = 1;

interface StoredBlobRecord {
  id: string;
  blob: Blob;
  name: string;
  mimeType: string;
  size: number;
  createdAt: number;
}

// In-memory cache for created object URLs so we don't recreate on every render
const objectUrlCache = new Map<string, string>();

/**
 * Open or initialize IndexedDB instance
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Save a File or Blob directly into IndexedDB without stringifying or freezing the UI
 * Returns a lightweight idb:// URI reference
 */
export async function saveMediaToIndexedDB(file: Blob | File, customId?: string): Promise<{ idbUrl: string; objectUrl: string; sizeBytes: number }> {
  const db = await openDB();
  const id = customId || `media_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const fileName = (file as File).name || 'uploaded_media';
  const mimeType = file.type || 'video/mp4';

  const record: StoredBlobRecord = {
    id,
    blob: file,
    name: fileName,
    mimeType,
    size: file.size,
    createdAt: Date.now()
  };

  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(record);

      request.onsuccess = () => {
        // Create and cache an active Object URL for instant playback
        const objectUrl = URL.createObjectURL(file);
        const idbUrl = `idb://${id}`;
        objectUrlCache.set(idbUrl, objectUrl);

        resolve({
          idbUrl,
          objectUrl,
          sizeBytes: file.size
        });
      };

      request.onerror = () => {
        reject(request.error || new Error('Failed to save media in IndexedDB'));
      };
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Retrieve a stored Blob from IndexedDB by ID
 */
export async function getMediaFromIndexedDB(id: string): Promise<Blob | null> {
  const cleanId = id.replace(/^idb:\/\//, '');
  const db = await openDB();

  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(cleanId);

      request.onsuccess = () => {
        const record = request.result as StoredBlobRecord | undefined;
        resolve(record ? record.blob : null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Resolve any URL (standard http, aparat, or idb://) to a playable/displayable URL
 */
export async function resolveMediaUrl(rawUrl: string | undefined): Promise<string> {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();

  // If already an object url, standard web link, or data url, return directly
  if (!trimmed.startsWith('idb://')) {
    return trimmed;
  }

  // Check cache first
  if (objectUrlCache.has(trimmed)) {
    return objectUrlCache.get(trimmed)!;
  }

  try {
    const blob = await getMediaFromIndexedDB(trimmed);
    if (blob) {
      const objectUrl = URL.createObjectURL(blob);
      objectUrlCache.set(trimmed, objectUrl);
      return objectUrl;
    }
  } catch (err) {
    console.warn('Failed to resolve IndexedDB media URL:', trimmed, err);
  }

  return '';
}

/**
 * Delete a media item from IndexedDB and revoke memory URL
 */
export async function deleteMediaFromIndexedDB(rawUrl: string): Promise<void> {
  if (!rawUrl || !rawUrl.startsWith('idb://')) return;
  const cleanId = rawUrl.replace(/^idb:\/\//, '');

  if (objectUrlCache.has(rawUrl)) {
    const existingUrl = objectUrlCache.get(rawUrl);
    if (existingUrl && existingUrl.startsWith('blob:')) {
      URL.revokeObjectURL(existingUrl);
    }
    objectUrlCache.delete(rawUrl);
  }

  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(cleanId);
  } catch (err) {
    console.warn('Failed to delete media from IndexedDB:', err);
  }
}

/**
 * Calculate total local database storage used by videos and media
 */
export async function getStorageStats(): Promise<{ count: number; totalBytes: number; formattedSize: string }> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const records = (request.result || []) as StoredBlobRecord[];
        let total = 0;
        records.forEach((r) => {
          total += r.size || 0;
        });
        resolve({
          count: records.length,
          totalBytes: total,
          formattedSize: formatBytes(total)
        });
      };

      request.onerror = () => {
        resolve({ count: 0, totalBytes: 0, formattedSize: '۰ بایت' });
      };
    });
  } catch {
    return { count: 0, totalBytes: 0, formattedSize: '۰ بایت' };
  }
}

/**
 * React Hook to transparently resolve idb:// URLs to active blob: URLs
 */
export function useResolvedMediaUrl(rawUrl: string | undefined): { resolvedUrl: string; isLoading: boolean } {
  const [resolvedUrl, setResolvedUrl] = useState<string>(() => {
    if (!rawUrl || typeof rawUrl !== 'string') return '';
    if (!rawUrl.startsWith('idb://')) return rawUrl;
    return objectUrlCache.get(rawUrl) || '';
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (!rawUrl || typeof rawUrl !== 'string') return false;
    if (!rawUrl.startsWith('idb://')) return false;
    return !objectUrlCache.has(rawUrl);
  });

  useEffect(() => {
    if (!rawUrl || typeof rawUrl !== 'string') {
      setResolvedUrl('');
      setIsLoading(false);
      return;
    }

    if (!rawUrl.startsWith('idb://')) {
      setResolvedUrl(rawUrl);
      setIsLoading(false);
      return;
    }

    if (objectUrlCache.has(rawUrl)) {
      setResolvedUrl(objectUrlCache.get(rawUrl)!);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    resolveMediaUrl(rawUrl).then((url) => {
      if (isMounted) {
        setResolvedUrl(url);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [rawUrl]);

  return { resolvedUrl, isLoading };
}

/**
 * Non-blocking lightweight video thumbnail generator
 * Creates a small ~15-25KB JPEG at 320x180 without freezing the JS event loop
 */
export function generateFastVideoThumbnail(file: File | Blob): Promise<string> {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      const tempUrl = URL.createObjectURL(file);
      video.src = tempUrl;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';

      let resolved = false;

      const finish = (result: string) => {
        if (!resolved) {
          resolved = true;
          try {
            video.pause();
            video.src = '';
            video.load();
          } catch {}
          URL.revokeObjectURL(tempUrl);
          resolve(result);
        }
      };

      // Set timeout fallback in case video fails to decode
      const timer = setTimeout(() => {
        finish('');
      }, 2500);

      video.onloadedmetadata = () => {
        // Seek to 1s or middle if short
        const targetTime = Math.min(1.0, video.duration > 0 ? video.duration / 3 : 0.5);
        video.currentTime = targetTime;
      };

      video.onseeked = () => {
        clearTimeout(timer);
        try {
          const canvas = document.createElement('canvas');
          // Scale down to max 360x200 to keep it very fast and tiny in storage
          canvas.width = 360;
          canvas.height = 202;
          const ctx = canvas.getContext('2d', { alpha: false });
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbBase64 = canvas.toDataURL('image/jpeg', 0.65);
            finish(thumbBase64);
            return;
          }
        } catch (e) {
          console.warn('Thumbnail generation failed:', e);
        }
        finish('');
      };

      video.onerror = () => {
        clearTimeout(timer);
        finish('');
      };
    } catch {
      resolve('');
    }
  });
}

/**
 * Image component that automatically resolves IndexedDB idb:// URLs as well as standard web URLs
 */
export const ResolvedImage: React.FC<{
  src: string | undefined;
  alt?: string;
  className?: string;
  fallback?: React.ReactNode;
}> = ({ src, alt = '', className = '', fallback = null }) => {
  const { resolvedUrl, isLoading } = useResolvedMediaUrl(src);

  if (isLoading || !resolvedUrl || typeof resolvedUrl !== 'string' || !resolvedUrl.trim()) {
    return (fallback as React.ReactElement) || null;
  }

  return React.createElement('img', { src: resolvedUrl, alt, className });
};

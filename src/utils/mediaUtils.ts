export interface ParsedVideo {
  type: 'aparat' | 'youtube' | 'direct' | 'iframe' | 'unknown';
  embedUrl?: string;
  directUrl?: string;
  videoId?: string;
  originalUrl: string;
  sourceLabel: string;
}

/**
 * Normalizes Persian and Arabic numerals to English digits
 */
export const normalizeDigits = (str: string): string => {
  return str
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1584))
    .trim();
};

/**
 * Intelligent video URL and embed parser
 * Supports: Aparat, YouTube, direct MP4/WebM/MOV/Blob/DataURL, and iframe tags
 */
export const parseVideoUrl = (rawUrl: string): ParsedVideo => {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return {
      type: 'unknown',
      originalUrl: '',
      sourceLabel: 'نامشخص'
    };
  }

  const trimmed = rawUrl.trim();

  // 1. Check if raw iframe was pasted
  if (trimmed.startsWith('<iframe') || trimmed.includes('<iframe')) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      const extractedSrc = srcMatch[1];
      if (extractedSrc.includes('aparat.com')) {
        return {
          type: 'aparat',
          embedUrl: extractedSrc,
          originalUrl: trimmed,
          sourceLabel: 'آپارات (Aparat)'
        };
      }
      if (extractedSrc.includes('youtube.com') || extractedSrc.includes('youtu.be')) {
        return {
          type: 'youtube',
          embedUrl: extractedSrc,
          originalUrl: trimmed,
          sourceLabel: 'یوتیوب (YouTube)'
        };
      }
      return {
        type: 'iframe',
        embedUrl: extractedSrc,
        originalUrl: trimmed,
        sourceLabel: 'کد فریم اختصاصی'
      };
    }
  }

  // 2. Check for Aparat (آپارات)
  // URLs like: https://www.aparat.com/v/xxxx or https://www.aparat.com/video/video/embed/videohash/xxxx/...
  const aparatMatch = trimmed.match(/aparat\.com\/(?:v|video\/video\/embed\/videohash|embed)\/([a-zA-Z0-9_-]+)/i);
  if (aparatMatch && aparatMatch[1]) {
    const videoId = aparatMatch[1];
    return {
      type: 'aparat',
      videoId,
      embedUrl: `https://www.aparat.com/video/video/embed/videohash/${videoId}/vt/frame`,
      originalUrl: trimmed,
      sourceLabel: 'سرویس آپارات'
    };
  }

  // 3. Check for YouTube
  // URLs like: https://youtu.be/xxxx or https://www.youtube.com/watch?v=xxxx or youtube.com/embed/xxxx
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
      originalUrl: trimmed,
      sourceLabel: 'یوتیوب'
    };
  }

  // 4. Local Uploaded IndexedDB, Blob URL, Data URL or direct file extension
  if (
    trimmed.startsWith('idb://') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:video/') ||
    trimmed.endsWith('.mp4') ||
    trimmed.endsWith('.webm') ||
    trimmed.endsWith('.mov') ||
    trimmed.endsWith('.m4v') ||
    trimmed.endsWith('.ogg') ||
    trimmed.endsWith('.mkv') ||
    trimmed.includes('googleusercontent.com') ||
    trimmed.includes('commondatastorage.googleapis.com') ||
    trimmed.includes('.mp4?') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return {
      type: 'direct',
      directUrl: trimmed,
      originalUrl: trimmed,
      sourceLabel: trimmed.startsWith('idb://') || trimmed.startsWith('blob:') || trimmed.startsWith('data:') ? 'ویدیو آپلود شده در حافظه کانون' : 'فایل مستقیم MP4'
    };
  }

  return {
    type: 'direct',
    directUrl: trimmed,
    originalUrl: trimmed,
    sourceLabel: 'لینک ویدیو'
  };
};

/**
 * Extracts a frame from a local video file as a Base64 JPEG thumbnail
 */
export const captureVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = 'anonymous';

      // Seek to 1 second to avoid potential black intro frame
      video.currentTime = 1;

      const cleanUp = () => {
        URL.revokeObjectURL(objectUrl);
      };

      video.onloadeddata = () => {
        video.currentTime = Math.min(1, video.duration > 0 ? video.duration / 2 : 0.5);
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            cleanUp();
            resolve(dataUrl);
            return;
          }
        } catch (e) {
          console.warn('Canvas thumbnail capture failed:', e);
        }
        cleanUp();
        resolve('');
      };

      video.onerror = () => {
        cleanUp();
        resolve('');
      };

      // Timeout fallback after 3 seconds
      setTimeout(() => {
        cleanUp();
        resolve('');
      }, 3000);
    } catch (err) {
      console.warn('Thumbnail generation error:', err);
      resolve('');
    }
  });
};

/**
 * Reads a file into Data URL format for reliable memory caching and offline persistence
 */
export const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data url'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

/**
 * Format bytes to readable Persian string
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '۰ بایت';
  const k = 1024;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = (bytes / Math.pow(k, i)).toFixed(1);
  return `${val} ${sizes[i]}`;
};

import React, { useState, useRef, useEffect } from 'react';
import { parseVideoUrl } from '../utils/mediaUtils';
import { useResolvedMediaUrl } from '../utils/indexedDBStorage';
import {
  Play,
  RotateCcw,
  AlertCircle,
  ExternalLink,
  Film,
  Download,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react';

interface SmartVideoPlayerProps {
  url: string;
  title?: string;
  thumbnail?: string;
  autoPlay?: boolean;
  className?: string;
}

export const SmartVideoPlayer: React.FC<SmartVideoPlayerProps> = ({
  url,
  title,
  thumbnail,
  autoPlay = true,
  className = ''
}) => {
  const cleanUrl = url && typeof url === 'string' ? url.trim() : '';
  const { resolvedUrl: resolvedDirectUrl, isLoading: isResolvingBlob } = useResolvedMediaUrl(cleanUrl);
  const parsed = parseVideoUrl(resolvedDirectUrl || cleanUrl);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [cleanUrl, resolvedDirectUrl]);

  if (!cleanUrl) {
    return (
      <div className={`relative w-full rounded-2xl overflow-hidden bg-slate-950/80 border border-slate-800 flex items-center justify-center min-h-[220px] text-slate-500 text-xs font-bold ${className}`}>
        <div className="flex flex-col items-center gap-2">
          <Film className="w-8 h-8 text-slate-600" />
          <span>ویدیویی برای نمایش وجود ندارد</span>
        </div>
      </div>
    );
  }

  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
    setErrorMessage('بارگذاری یا پخش فایل ویدیو با خطا مواجه شد. ممکن است لینک منقضی شده یا فرمت پشتیبانی نشود.');
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    if (videoRef.current) {
      try {
        videoRef.current.load();
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Gracefully ignore autoplay permission issues
          });
        }
      } catch (e) {
        console.warn('Retry play error:', e);
      }
    }
  };

  // 1. Aparat (آپارات) Embed
  if (parsed.type === 'aparat' && parsed.embedUrl) {
    return (
      <div className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 ${className}`}>
        <iframe
          src={parsed.embedUrl}
          title={title || 'پخش‌کننده آپارات کانون'}
          allowFullScreen
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    );
  }

  // 2. YouTube Embed
  if (parsed.type === 'youtube' && parsed.embedUrl) {
    return (
      <div className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 ${className}`}>
        <iframe
          src={parsed.embedUrl}
          title={title || 'پخش‌کننده یوتیوب'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    );
  }

  // 3. Generic Iframe
  if (parsed.type === 'iframe' && parsed.embedUrl) {
    return (
      <div className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 ${className}`}>
        <iframe
          src={parsed.embedUrl}
          title={title || 'پخش ویدیو'}
          allowFullScreen
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    );
  }

  // 4. Direct Video Stream / Local Uploaded Blob / Data URL / MP4 / WebM
  const videoSrc = parsed.directUrl || cleanUrl;

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 flex items-center justify-center min-h-[260px] ${className}`}>
      {/* Error View */}
      {hasError ? (
        <div className="p-8 text-center space-y-4 max-w-md my-auto">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 mx-auto flex items-center justify-center shadow-lg">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">خطا در بارگذاری ویدیو</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {errorMessage}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={handleRetry}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تلاش مجدد</span>
            </button>
            <a
              href={videoSrc}
              target="_blank"
              rel="noreferrer"
              download
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود مستقیم فایل</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            src={videoSrc || undefined}
            poster={thumbnail && thumbnail.trim() ? thumbnail : undefined}
            controls
            playsInline
            autoPlay={autoPlay}
            onLoadedData={() => setIsLoading(false)}
            onWaiting={() => setIsLoading(true)}
            onPlaying={() => setIsLoading(false)}
            onError={handleVideoError}
            className="w-full max-h-[70vh] rounded-2xl object-contain bg-black"
          >
            مرورگر شما از پخش مستقیم این ویدیو پشتیبانی نمی‌کند.
          </video>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center gap-2 text-white">
                <div className="w-9 h-9 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-slate-200">در حال آماده‌سازی ویدیو...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

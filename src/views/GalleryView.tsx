import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Image as ImageIcon,
  Video,
  Play,
  Maximize2,
  X,
  Calendar,
  Filter,
  Download,
  Share2,
  Film,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaItem } from '../types';
import { SmartVideoPlayer } from '../components/SmartVideoPlayer';
import { parseVideoUrl } from '../utils/mediaUtils';
import { ResolvedImage } from '../utils/indexedDBStorage';

export const GalleryView: React.FC = () => {
  const { mediaList, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'video' | 'image'>('all');
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);

  const categories = ['همه', 'علمی', 'اردوها', 'سرود', 'ورزشی', 'مستند'];

  const filteredMedia = mediaList.filter((item) => {
    const matchesCategory = selectedCategory === 'همه' || item.category === selectedCategory;
    const matchesType =
      mediaTypeFilter === 'all' ||
      (mediaTypeFilter === 'video' && item.type === 'video') ||
      (mediaTypeFilter === 'image' && item.type === 'image');
    return matchesCategory && matchesType;
  });

  const handleShare = (item: MediaItem) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(item.url).catch(() => {});
      showToast('لینک رسانه کپی شد!', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>رسانه‌خانه و نگارخانه کانون منتظر</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">گالری تصاویر و ویدیوهای تربیتی</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            مستندات تصویری اردوها، کلیپ‌های آپارات، مسابقات رباتیک و لحظات ماندگار اعضای کانون
          </p>
        </div>

        {/* Type Switcher Pills */}
        <div className="flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setMediaTypeFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              mediaTypeFilter === 'all'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>همه رسانه‌ها</span>
          </button>
          <button
            onClick={() => setMediaTypeFilter('video')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              mediaTypeFilter === 'video'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>فقط ویدیوها ({mediaList.filter((m) => m.type === 'video').length})</span>
          </button>
          <button
            onClick={() => setMediaTypeFilter('image')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              mediaTypeFilter === 'image'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>فقط عکس‌ها ({mediaList.filter((m) => m.type === 'image').length})</span>
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 flex-shrink-0 pl-2">
          <Filter className="w-3.5 h-3.5" />
          دسته‌بندی موضوعی:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
              selectedCategory === cat
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">رسانه‌ای در این دسته یافت نشد</h3>
          <p className="text-xs text-slate-500">می‌توانید فیلترها را تغییر داده یا از بخش مدیریت ویدیوی جدید اضافه کنید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedia.map((item) => {
            const isVideo = item.type === 'video';
            const parsed = isVideo ? parseVideoUrl(item.url) : null;
            const thumbUrl = item.thumbnail || (parsed?.type === 'direct' ? '' : item.thumbnail) || item.url;

            return (
              <div
                key={item.id}
                onClick={() => setActiveMedia(item)}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative h-52 bg-slate-950 overflow-hidden flex items-center justify-center">
                  {thumbUrl && typeof thumbUrl === 'string' && thumbUrl.trim() ? (
                    <ResolvedImage
                      src={thumbUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallback={
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 to-indigo-950 flex flex-col items-center justify-center text-slate-400 gap-2 p-4 text-center">
                          <Film className="w-10 h-10 text-amber-400/80" />
                          <span className="text-[11px] font-bold text-slate-300 line-clamp-1">{item.title}</span>
                        </div>
                      }
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-indigo-950 flex flex-col items-center justify-center text-slate-400 gap-2 p-4 text-center">
                      <Film className="w-10 h-10 text-amber-400/80" />
                      <span className="text-[11px] font-bold text-slate-300 line-clamp-1">{item.title}</span>
                    </div>
                  )}

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    {isVideo ? (
                      <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/10">
                    {item.category}
                  </div>

                  {/* Video Type Badge */}
                  {isVideo && (
                    <div className="absolute bottom-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                      <Video className="w-3 h-3" />
                      <span>{parsed?.sourceLabel || 'ویدیو'}</span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
                    {item.title}
                  </h4>
                  {item.date && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox / Video Modal */}
      <AnimatePresence>
        {activeMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 text-white rounded-3xl overflow-hidden max-w-4xl w-full border border-slate-800 shadow-2xl relative flex flex-col max-h-[92vh]"
            >
              {/* Header */}
              <div className="p-4 bg-slate-950/90 flex items-center justify-between border-b border-slate-800">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {activeMedia.type === 'video' ? (
                      <Video className="w-4 h-4 text-amber-400" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-sky-400" />
                    )}
                    <span>{activeMedia.title}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    دسته‌بندی: {activeMedia.category} • {activeMedia.date}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(activeMedia)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="کپی لینک مستقیم"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <a
                    href={activeMedia.url}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="دانلود یا باز کردن مستقیم"
                  >
                    <Download className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setActiveMedia(null)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Media Content */}
              <div className="p-4 flex-1 flex items-center justify-center bg-black overflow-hidden min-h-[300px]">
                {activeMedia.type === 'video' ? (
                  <SmartVideoPlayer
                    url={activeMedia.url}
                    title={activeMedia.title}
                    thumbnail={activeMedia.thumbnail}
                    autoPlay={true}
                  />
                ) : (
                  <ResolvedImage
                    src={activeMedia.url}
                    alt={activeMedia.title}
                    className="max-h-[65vh] max-w-full object-contain rounded-2xl"
                  />
                )}
              </div>

              {/* Description Footer */}
              {activeMedia.description && (
                <div className="p-4 bg-slate-950/90 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {activeMedia.description}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


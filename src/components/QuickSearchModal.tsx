import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, BookOpen, GraduationCap, Compass, Music, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const { articles, courses, events, chants, navigateTo, playChant } = useApp();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return { articles: [], courses: [], events: [], chants: [] };
    const q = query.trim().toLowerCase();

    return {
      articles: articles.filter(
        (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q))
      ),
      courses: courses.filter(
        (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q)
      ),
      events: events.filter(
        (e) => e.title.toLowerCase().includes(q) || e.destination.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
      ),
      chants: chants.filter(
        (s) => s.title.toLowerCase().includes(q) || s.singerGroup.toLowerCase().includes(q)
      )
    };
  }, [query, articles, courses, events, chants]);

  const totalResults =
    searchResults.articles.length +
    searchResults.courses.length +
    searchResults.events.length +
    searchResults.chants.length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Search Bar Input */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Search className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو در اخبار، دوره‌های آموزشی، اردوها و سرودها..."
              className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none text-sm md:text-base font-sans"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                پاک کردن
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="overflow-y-auto p-4 space-y-6 flex-1">
            {!query.trim() ? (
              <div className="text-center py-10 text-slate-400 dark:text-slate-500 space-y-2">
                <Search className="w-10 h-10 mx-auto stroke-1 text-slate-300 dark:text-slate-600" />
                <p className="text-sm">عبارت مورد نظر خود را تایپ کنید</p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <span className="text-xs text-slate-400">پیشنهادات:</span>
                  {['رباتیک', 'اردوی مشهد', 'قرآن', 'سرود ظهور', 'فوتسال'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      className="px-2.5 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 transition"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ) : totalResults === 0 ? (
              <div className="text-center py-10 text-slate-400 space-y-2">
                <p className="text-sm font-semibold">موردی برای «{query}» یافت نشد</p>
                <p className="text-xs text-slate-500">کلمات کلیدی دیگری را جستجو کنید</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Articles */}
                {searchResults.articles.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                      اخبار و مقالات ({searchResults.articles.length})
                    </h4>
                    <div className="space-y-1.5">
                      {searchResults.articles.map((art) => (
                        <button
                          key={art.id}
                          onClick={() => {
                            navigateTo('article-detail', art.id);
                            onClose();
                          }}
                          className="w-full text-right p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={art.coverImage}
                              alt={art.title}
                              className="w-11 h-11 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition line-clamp-1">
                                {art.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                {art.excerpt}
                              </p>
                            </div>
                          </div>
                          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition flex-shrink-0 mr-2" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Courses */}
                {searchResults.courses.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                      دوره‌های آموزشی ({searchResults.courses.length})
                    </h4>
                    <div className="space-y-1.5">
                      {searchResults.courses.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            navigateTo('course-detail', c.id);
                            onClose();
                          }}
                          className="w-full text-right p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={c.image}
                              alt={c.title}
                              className="w-11 h-11 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition line-clamp-1">
                                {c.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                مربی: {c.instructor} | هزینه: {c.fee}
                              </p>
                            </div>
                          </div>
                          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition flex-shrink-0 mr-2" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Events */}
                {searchResults.events.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-amber-500" />
                      اردوها و رویدادها ({searchResults.events.length})
                    </h4>
                    <div className="space-y-1.5">
                      {searchResults.events.map((ev) => (
                        <button
                          key={ev.id}
                          onClick={() => {
                            navigateTo('event-detail', ev.id);
                            onClose();
                          }}
                          className="w-full text-right p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={ev.image}
                              alt={ev.title}
                              className="w-11 h-11 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition line-clamp-1">
                                {ev.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                مقصد: {ev.destination} | تاریخ: {ev.startDate}
                              </p>
                            </div>
                          </div>
                          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition flex-shrink-0 mr-2" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chants */}
                {searchResults.chants.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5 text-indigo-500" />
                      سرودها و پادکست‌ها ({searchResults.chants.length})
                    </h4>
                    <div className="space-y-1.5">
                      {searchResults.chants.map((ch) => (
                        <button
                          key={ch.id}
                          onClick={() => {
                            playChant(ch);
                            onClose();
                          }}
                          className="w-full text-right p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={ch.coverImage}
                              alt={ch.title}
                              className="w-11 h-11 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                                {ch.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {ch.singerGroup} | مدت: {ch.duration}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-lg">
                            پخش نوا
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Search,
  Filter,
  Calendar,
  Eye,
  Heart,
  MessageSquare,
  ArrowLeft,
  Tag
} from 'lucide-react';
import { CategoryType } from '../types';

export const NewsView: React.FC = () => {
  const { articles, navigateTo } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'همه',
    'فرهنگی',
    'مذهبی',
    'علمی_رباتیک',
    'اردویی_ورزشی',
    'سرود_هنر',
    'اطلاعیه'
  ];

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchCategory =
        selectedCategory === 'همه' || art.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-800 to-indigo-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>پایگاه خبر و رسانه کانون منتظر</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">اخبار، مقالات و رویدادها</h1>
          <p className="text-xs sm:text-sm text-sky-200">
            گزارش فعالیت‌ها، مقالات آموزشی، اطلاعیه‌های مهم و دستاوردهای اعضای کانون
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در بین مقالات..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-300 text-xs focus:outline-none focus:bg-white/20"
            />
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 flex-shrink-0 pl-2">
          <Filter className="w-3.5 h-3.5" />
          دسته‌بندی:
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
            {cat === 'همه' ? 'همه موضوعات' : cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3 stroke-1" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-base">
            مطلبی یافت نشد
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            با تغییر فیلتر یا کلمات جستجو دوباره تلاش کنید.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => navigateTo('article-detail', art.id)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col group"
            >
              <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={art.coverImage}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-sky-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {art.category.replace('_', ' ')}
                </div>
                {art.isFeatured && (
                  <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md">
                    ویژه
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {art.publishedAt}
                    </span>
                    <span>•</span>
                    <span>{art.author}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {art.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                      {art.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {art.comments?.length || 0}
                    </span>
                  </div>
                  <span className="text-sky-600 dark:text-sky-400 font-bold group-hover:underline flex items-center gap-0.5">
                    مطالعه کامل
                    <ArrowLeft className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

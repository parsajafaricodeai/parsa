import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  Calendar,
  Eye,
  Heart,
  Share2,
  Tag,
  MessageSquare,
  User,
  Send,
  CheckCircle2
} from 'lucide-react';

export const ArticleDetailView: React.FC = () => {
  const { selectedId, articles, navigateTo, likeArticle, addComment, showToast } = useApp();
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const article = articles.find((a) => a.id === selectedId) || articles[0];

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p>مطلب مورد نظر یافت نشد.</p>
        <button
          onClick={() => navigateTo('news')}
          className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold"
        >
          بازگشت به لیست مقالات
        </button>
      </div>
    );
  }

  const handleLike = () => {
    if (!isLiked) {
      likeArticle(article.id);
      setIsLiked(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href
      }).catch(() => {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      showToast('پیوند مقاله کپی شد!', 'success', 'می‌توانید آن را با دوستان خود به اشتراک بگذارید.');
    } else {
      showToast('پیوند مقاله: ' + window.location.href, 'info');
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) {
      showToast('لطفاً نام و متن دیدگاه را تکمیل کنید', 'warning');
      return;
    }
    addComment(article.id, commentName, commentText);
    setCommentName('');
    setCommentText('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigateTo('news')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <ArrowRight className="w-4 h-4" />
        <span>بازگشت به لیست اخبار و مقالات</span>
      </button>

      {/* Main Article Container */}
      <article className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 sm:p-10 space-y-6">
        {/* Category & Date Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800">
              {article.category.replace('_', ' ')}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {article.publishedAt}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              {article.views} بازدید
            </span>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-sky-600 transition"
              title="اشتراک‌گذاری"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-snug">
          {article.title}
        </h1>

        {/* Author details */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">نویسنده / منبع: {article.author}</p>
            <p className="text-[11px] text-slate-500">پایگاه اطلاع‌رسانی کانون نوجوانان منتظر</p>
          </div>
        </div>

        {/* Cover Image */}
        <div className="rounded-2xl overflow-hidden shadow-md max-h-[440px] bg-slate-100 dark:bg-slate-800">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Excerpt */}
        <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border-r-4 border-sky-600 text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
          {article.excerpt}
        </div>

        {/* Rich HTML Content Body */}
        <div
          className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-loose text-sm sm:text-base space-y-4"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              برچسب‌ها:
            </span>
            {article.tags.map((t) => (
              <span
                key={t}
                className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Like & Reaction Box */}
        <div className="pt-4 flex items-center justify-between">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm ${
              isLiked
                ? 'bg-rose-500 text-white'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 border border-rose-200 dark:border-rose-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{article.likes} پسندیدم</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>اشتراک‌گذاری مطلب</span>
          </button>
        </div>
      </article>

      {/* Comments Section */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <MessageSquare className="w-5 h-5 text-sky-500" />
          <span>دیدگاه‌ها و نظرات ({article.comments?.length || 0})</span>
        </div>

        {/* Submit Comment Form */}
        <form onSubmit={handleCommentSubmit} className="space-y-4 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
            ارسال دیدگاه یا پرسش درباره این مطلب:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                placeholder="نام و نام خانوادگی..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 font-sans"
              />
            </div>
          </div>
          <div>
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="دیدگاه خود را بنویسید..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 font-sans"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              ثبت دیدگاه
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-3">
          {(!article.comments || article.comments.length === 0) ? (
            <p className="text-xs text-slate-400 text-center py-4">
              اولین نفری باشید که برای این مطلب دیدگاه ثبت می‌کند!
            </p>
          ) : (
            article.comments.map((comm) => (
              <div
                key={comm.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {comm.authorName}
                  </span>
                  <span className="text-slate-400">{comm.createdAt}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {comm.text}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

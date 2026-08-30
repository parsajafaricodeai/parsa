import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Users,
  GraduationCap,
  Compass,
  Trophy,
  ArrowLeft,
  Calendar,
  Clock,
  Play,
  Heart,
  Eye,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  IdCard,
  Music,
  MapPin,
  Flame,
  Volume2,
  Video,
  Film
} from 'lucide-react';
import { motion } from 'motion/react';
import { SmartVideoPlayer } from '../components/SmartVideoPlayer';

export const HomeView: React.FC = () => {
  const {
    siteSettings,
    articles,
    courses,
    events,
    chants,
    mediaList,
    navigateTo,
    playChant,
    activeChant,
    isPlayingAudio
  } = useApp();

  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const nextBanner = () => {
    setActiveBannerIndex((prev) => (prev + 1) % siteSettings.banners.length);
  };

  const prevBanner = () => {
    setActiveBannerIndex(
      (prev) => (prev - 1 + siteSettings.banners.length) % siteSettings.banners.length
    );
  };

  const currentBanner = siteSettings.banners[activeBannerIndex] || siteSettings.banners[0];
  const featuredArticles = articles.slice(0, 3);
  const activeCourses = courses.slice(0, 3);
  const upcomingEvents = events.slice(0, 2);

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section Slider */}
      <section className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 bg-slate-900 text-white shadow-2xl border border-slate-800">
        <div className="relative min-h-[460px] md:min-h-[520px] flex items-center">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={currentBanner.image}
              alt={currentBanner.title}
              className="w-full h-full object-cover opacity-35 scale-105 transition-all duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 max-w-3xl p-6 sm:p-10 md:p-14 space-y-5">
            <motion.div
              key={currentBanner.id + '-badge'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentBanner.badge}</span>
            </motion.div>

            <motion.h1
              key={currentBanner.id + '-title'}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight text-white"
            >
              {currentBanner.title}
            </motion.h1>

            <motion.p
              key={currentBanner.id + '-sub'}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl"
            >
              {currentBanner.subtitle}
            </motion.p>

            <motion.div
              key={currentBanner.id + '-btn'}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-3 flex flex-wrap items-center gap-3"
            >
              <button
                onClick={() => navigateTo(currentBanner.linkTab as any)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>{currentBanner.buttonText}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateTo('membership')}
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition flex items-center gap-2"
              >
                <IdCard className="w-4 h-4 text-sky-400" />
                <span>عضویت در کانون</span>
              </button>
            </motion.div>
          </div>

          {/* Slider navigation arrows */}
          <div className="absolute left-4 bottom-4 z-20 flex items-center gap-2">
            <button
              onClick={prevBanner}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition"
              title="بنر قبلی"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 px-2">
              {siteSettings.banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveBannerIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    activeBannerIndex === i ? 'w-6 bg-amber-400' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextBanner}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition"
              title="بنر بعدی"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Key Achievements & Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                +{siteSettings.stats.activeMembers}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                نوجوان عضو فعال کانون
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                +{siteSettings.stats.heldCourses}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                دوره آموزشی و کارگاه تخصصی
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                +{siteSettings.stats.heldCamps}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                اردوی زیارتی، جهادی و علمی
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                +{siteSettings.stats.honorCount}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                رتبه برتر استانی و کشوری
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>مهارت‌آموزی و رشد استعداد</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              دوره‌ها و کلاس‌های ترم جاری
            </h2>
          </div>
          <button
            onClick={() => navigateTo('courses')}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>مشاهده همه دوره‌ها</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeCourses.map((course) => {
            const percentFilled = Math.min(
              100,
              Math.round((course.enrolledCount / course.capacity) * 100)
            );
            return (
              <div
                key={course.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                    {course.category.replace('_', ' ')}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-amber-500 text-slate-950 text-xs font-extrabold px-2.5 py-1 rounded-lg shadow-md">
                    {course.fee}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-sky-500" />
                        {course.duration}
                      </span>
                      <span>رده سنی: {course.ageGroup}</span>
                    </div>

                    {/* Capacity progress bar */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
                        <span>ظرفیت تکمیل شده:</span>
                        <span>
                          {course.enrolledCount} از {course.capacity} نفر
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full"
                          style={{ width: `${percentFilled}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => navigateTo('course-detail', course.id)}
                      className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-600 dark:hover:text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <span>جزییات دوره و ثبت‌نام</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Upcoming Camps & Events Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 rounded-3xl p-6 sm:p-10 text-white border border-indigo-900/50 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
                <Compass className="w-4 h-4" />
                اردوهای تربیتی، زیارتی و مسابقات کانون
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                برنامه‌ها و رویدادهای پیش‌رو
              </h2>
            </div>
            <button
              onClick={() => navigateTo('events')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition self-start md:self-auto flex items-center gap-1.5"
            >
              <span>مشاهده تقویم تمام اردوها</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
            {upcomingEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700/80 p-5 sm:p-6 flex flex-col sm:flex-row gap-5 hover:border-amber-500/50 transition duration-300"
              >
                <div className="w-full sm:w-44 h-40 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-md">
                      {ev.startDate}
                    </span>
                    <h3 className="text-base font-bold text-white mt-2 line-clamp-1">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {ev.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      <span className="truncate max-w-[140px]">{ev.destination}</span>
                    </div>
                    <button
                      onClick={() => navigateTo('event-detail', ev.id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold hover:from-amber-600 hover:to-amber-700 transition"
                    >
                      پیش‌ثبت‌نام آنلاین
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Chants & Podcasts Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
              <Music className="w-4 h-4" />
              <span>نواها و آواهای انقلابی نوجوانان</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              سرودهای اختصاصی و پادکست‌های کانون
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {chants.map((chant) => {
            const isThisPlaying = activeChant?.id === chant.id && isPlayingAudio;
            return (
              <div
                key={chant.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex items-center gap-4 group"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800">
                  <img
                    src={chant.coverImage}
                    alt={chant.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <button
                    onClick={() => playChant(chant)}
                    className="absolute inset-0 bg-black/40 group-hover:bg-black/60 flex items-center justify-center text-amber-400 transition"
                  >
                    {isThisPlaying ? (
                      <Volume2 className="w-6 h-6 animate-pulse" />
                    ) : (
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    )}
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {chant.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {chant.singerGroup}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>مدت: {chant.duration}</span>
                    <span>{chant.plays} شنونده</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5.5. Video Gallery Showcase */}
      {mediaList.filter((m) => m.type === 'video').length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-500 mb-1">
                <Video className="w-4 h-4" />
                <span>رسانه‌خانه، کلیپ‌ها و مستندات تصویری</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                ویدیوها و گزارش‌های تصویری کانون
              </h2>
            </div>
            <button
              onClick={() => navigateTo('gallery')}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 flex items-center gap-1 group self-start sm:self-auto"
            >
              <span>مشاهده تمام ویدیوها و تصاویر در گالری</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaList
              .filter((m) => m.type === 'video')
              .slice(0, 3)
              .map((video) => (
                <div
                  key={video.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition"
                >
                  <div className="bg-slate-950">
                    <SmartVideoPlayer
                      url={video.url}
                      title={video.title}
                      thumbnail={video.thumbnail}
                      autoPlay={false}
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="font-bold text-amber-500 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/30">
                          {video.category}
                        </span>
                        <span>{video.date}</span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* 6. Latest News & Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>پایگاه خبر و رسانه کانون</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              آخرین اخبار، گزارش‌ها و مقالات
            </h2>
          </div>
          <button
            onClick={() => navigateTo('news')}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>مشاهده همه مقالات و اخبار</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => navigateTo('article-detail', art.id)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={art.coverImage}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-sky-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {art.category.replace('_', ' ')}
                </div>
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
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {art.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                      {art.likes}
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
      </section>

      {/* 7. Digital Membership Callout Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-8 md:p-12 text-slate-950 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 text-amber-400 text-xs font-black">
              <IdCard className="w-4 h-4" />
              صدور آنی و کاملاً رایگان
            </div>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight text-slate-950">
              هنوز کارت عضویت دیجیتال کانون را دریافت نکرده‌اید؟
            </h2>
            <p className="text-sm font-medium text-slate-900 leading-relaxed">
              با ثبت‌نام در کانون، کد اختصاصی، کیوآرکد شناسایی، امتیازات باشگاه نوجوانان و تخفیف ویژه در اردوها و دوره‌های مهارتی برای شما صادر خواهد شد.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigateTo('membership')}
                className="px-8 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-sm shadow-xl transition transform hover:scale-105 flex items-center gap-2"
              >
                <span>ثبت‌نام آنلاین و صدور کارت دیجیتال</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-full max-w-xs bg-slate-900 text-white p-5 rounded-2xl border-2 border-slate-950 shadow-2xl space-y-4 transform rotate-1 hover:rotate-0 transition">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold">کارت عضویت کانون</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
                MN-1403-108
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-slate-800 overflow-hidden border border-slate-700 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-white">امیرعلی صادقیان</p>
                <p className="text-slate-400 text-[11px]">واحد شهید باکری</p>
                <p className="text-amber-400 font-mono text-[10px]">امتیاز: ۴۸۰ پوینت</p>
              </div>
            </div>
            <div className="bg-slate-950 p-2 rounded-xl text-center text-[10px] text-slate-400">
              معتبر در کلیه اردوها و مراکز طرف قرارداد
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

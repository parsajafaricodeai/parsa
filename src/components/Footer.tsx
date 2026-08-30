import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Send,
  Heart,
  ShieldCheck,
  Award,
  BookOpen,
  IdCard,
  MessageSquare
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { siteSettings, navigateTo, setIsLoginModalOpen, isAdmin } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-14 pb-28 md:pb-16 mt-20 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Organization Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-amber-500 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <span className="font-extrabold text-white text-lg">{siteSettings.name}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              {siteSettings.aboutText}
            </p>
            <div className="pt-2">
              <span className="inline-block text-xs font-semibold text-amber-400 bg-amber-950/40 border border-amber-800/60 px-3 py-1.5 rounded-xl">
                ✨ {siteSettings.motto}
              </span>
            </div>
          </div>

          {/* Column 2: Fast Navigation */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              دسترسی سریع به بخش‌ها
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('news')}
                  className="hover:text-amber-400 transition"
                >
                  ● اخبار و گزارش‌های کانون
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('courses')}
                  className="hover:text-amber-400 transition"
                >
                  ● دوره‌های علمی، قرآنی و مهارتی
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('events')}
                  className="hover:text-amber-400 transition"
                >
                  ● اردوهای زیارتی، تفریحی و جهادی
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('gallery')}
                  className="hover:text-amber-400 transition"
                >
                  ● گالری تصاویر و ویدیوها
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('membership')}
                  className="hover:text-amber-400 transition text-sky-300 font-bold"
                >
                  ● ثبت‌نام و دریافت کارت عضویت دیجیتال
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-amber-400 transition"
                >
                  ● تاریخچه و مربیان کانون
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Communication */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              اطلاعات ارتباطی و آدرس
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{siteSettings.contactAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>تلفن تماس: {siteSettings.phone1}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>پست الکترونیک: {siteSettings.email}</span>
              </div>
            </div>

            {/* Social channels badges */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <p className="text-[11px] text-slate-400 mb-2 font-medium">کانال‌های رسمی کانون در پیام‌رسان‌ها:</p>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <a
                  href={siteSettings.socialLinks.eitaa}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-orange-950/40 text-orange-400 border border-orange-800/40 hover:bg-orange-900/40 transition"
                >
                  ایتا
                </a>
                <a
                  href={siteSettings.socialLinks.bale}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/40 transition"
                >
                  بله
                </a>
                <a
                  href={siteSettings.socialLinks.rubika}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-purple-950/40 text-purple-400 border border-purple-800/40 hover:bg-purple-900/40 transition"
                >
                  روبیکا
                </a>
                <a
                  href={siteSettings.socialLinks.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-sky-950/40 text-sky-400 border border-sky-800/40 hover:bg-sky-900/40 transition"
                >
                  تلگرام
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter & Admin Access */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              افتخارات و عضویت
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              عضویت در کانون برای عموم نوجوانان ۱۱ الی ۱۸ سال آزاد و رایگان می‌باشد.
            </p>

            <button
              onClick={() => navigateTo('membership')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 mb-4"
            >
              <IdCard className="w-4 h-4" />
              ثبت‌نام آنلاین و صدور کارت دیجیتال
            </button>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">پورتال اختصاصی کادر کانون</span>
              {!isAdmin ? (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold underline"
                >
                  ورود مدیران
                </button>
              ) : (
                <button
                  onClick={() => navigateTo('admin')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold"
                >
                  ورود به پنل ادمین
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© تمامی حقوق برای کانون فرهنگی تربیتی نوجوانان منتظر محفوظ است.</p>
          <p className="flex items-center gap-1 text-slate-400">
            ساخته شده با <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> برای رشد و پویایی نسل جوان
          </p>
        </div>
      </div>
    </footer>
  );
};

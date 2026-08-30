import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Users,
  Target,
  Award,
  BookOpen,
  Heart,
  ShieldCheck,
  Zap,
  Globe,
  Smile
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { siteSettings } = useApp();

  const pillars = [
    {
      title: 'رشد علمی و فناوری',
      desc: 'پرورش تفکر خلاق، آموزش رباتیک، کدنویسی و هوش مصنوعی همگام با فناوری‌های روز دنیا.',
      icon: Zap,
      color: 'from-sky-500 to-indigo-600'
    },
    {
      title: 'معارف و تربیت قرآنی',
      desc: 'انس با کلام وحی، آموزش ترتیل و صوت، و تبیین سبک زندگی اسلامی در قالب گفت‌وگوهای صمیمی.',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'هنر و رسانه نوین',
      desc: 'کشف استعدادهای سرود، گویندگی، ساخت پادکست، عکاسی و تدوین ویدیو با استانداردهای نوین.',
      icon: Sparkles,
      color: 'from-purple-500 to-indigo-600'
    },
    {
      title: 'ورزش، نشاط و مهارت',
      desc: 'برگزاری لیگ‌های ورزشی، اردوهای جهادی، بقا در طبیعت و تقویت کار گروهی و مسئولیت‌پذیری.',
      icon: Smile,
      color: 'from-amber-500 to-orange-600'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl border border-slate-800 relative overflow-hidden text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-amber-300 text-xs font-bold mx-auto border border-white/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>درباره کانون فرهنگی تربیتی نوجوانان منتظر</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          محیطی برای رشد، شکوفایی و خلاقیت نوجوانان
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {siteSettings.motto}
        </p>
      </div>

      {/* About & Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">داستان و رسالت ما</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-loose">
            {siteSettings.aboutText}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">چشم‌انداز و افق تربیتی</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-loose">
            {siteSettings.visionText}
          </p>
        </div>
      </div>

      {/* 4 Pillars */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            چهار ستون اصلی فعالیت‌های کانون
          </h2>
          <p className="text-xs text-slate-500">
            برنامه‌ریزی متوازن برای تقویت ابعاد مختلف شخصیتی و مهارتی نوجوانان
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pil, idx) => {
            const Icon = pil.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition flex flex-col justify-between space-y-4"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${pil.color} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                    {pil.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {pil.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mentors & Leadership Team */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            اساتید، مربیان و سرگروه‌های کانون
          </h2>
          <p className="text-xs text-slate-500">
            کادری مجرب، دلسوز و متعهد همراه و راهنمای نوجوانان
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteSettings.leaders.map((lead) => (
            <div
              key={lead.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col group"
            >
              <div className="h-56 bg-slate-800 overflow-hidden">
                <img
                  src={lead.photo}
                  alt={lead.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 space-y-2 text-center flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {lead.name}
                  </h3>
                  <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mt-0.5">
                    {lead.role}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {lead.bio}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                  تخصص: {lead.specialty}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

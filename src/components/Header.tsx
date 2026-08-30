import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu,
  X,
  Search,
  Moon,
  Sun,
  Shield,
  GraduationCap,
  Sparkles,
  IdCard,
  Layers,
  ChevronDown
} from 'lucide-react';
import { QuickSearchModal } from './QuickSearchModal';

export const Header: React.FC = () => {
  const {
    currentView,
    navigateTo,
    isDark,
    toggleDark,
    isAdmin,
    setIsLoginModalOpen,
    siteSettings
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'صفحه اصلی' },
    { id: 'news', label: 'اخبار و مقالات' },
    { id: 'courses', label: 'دوره‌های آموزشی' },
    { id: 'events', label: 'اردوها و رویدادها' },
    { id: 'gallery', label: 'گالری چندرسانه‌ای' },
    { id: 'membership', label: 'کارت عضویت دیجیتال' },
    { id: 'about', label: 'درباره کانون' },
    { id: 'contact', label: 'تماس و نظرات' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        {/* Top Notification Announcement Bar */}
        <div className="bg-gradient-to-r from-sky-800 via-indigo-900 to-sky-900 text-white text-xs py-1.5 px-4 hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-semibold text-amber-300">اطلاعیه مهم:</span>
              <span>ثبت‌نام ترم جدید کلاس‌های رباتیک و اعزام اردوی مشهد مقدس آغاز شد.</span>
            </div>
            <div className="flex items-center gap-4 text-sky-200">
              <span>تلفن روابط عمومی: {siteSettings.phone1}</span>
              <span>|</span>
              <button
                onClick={() => navigateTo('membership')}
                className="text-amber-300 hover:underline font-bold flex items-center gap-1"
              >
                <IdCard className="w-3.5 h-3.5" />
                دریافت آنلاین کارت عضویت
              </button>
            </div>
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Brand Logo & Name */}
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 text-right group focus:outline-none"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-600 via-indigo-700 to-amber-500 p-0.5 shadow-md shadow-sky-600/20 group-hover:scale-105 transition transform">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-amber-500 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base md:text-lg text-slate-900 dark:text-white tracking-tight leading-tight">
                  {siteSettings.name}
                </span>
                <span className="text-[11px] font-medium text-sky-600 dark:text-sky-400">
                  مرکز پرورش استعداد و خلاقیت نوجوانان
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  currentView === item.id ||
                  (item.id === 'news' && currentView === 'article-detail') ||
                  (item.id === 'courses' && currentView === 'course-detail') ||
                  (item.id === 'events' && currentView === 'event-detail');

                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 relative ${
                      isActive
                        ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-sky-600 dark:bg-sky-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="جستجو در سایت (Ctrl+K)"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDark}
                className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title={isDark ? 'حالت روز' : 'حالت شب'}
              >
                {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Admin Panel Button */}
              {isAdmin ? (
                <button
                  onClick={() => navigateTo('admin')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                    currentView === 'admin'
                      ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                      : 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white hover:opacity-90'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>پنل مدیریت</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  title="ورود مدیران و کادر کانون"
                >
                  <Shield className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span className="hidden sm:inline">ورود مدیر</span>
                </button>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-1 shadow-xl">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigateTo(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-right px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-sky-600"></span>}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Quick Search Modal */}
      <QuickSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

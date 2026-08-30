import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, X, KeyRound, Sparkles, UserCheck, Phone, CheckCircle2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminLoginModal: React.FC = () => {
  const { 
    isLoginModalOpen, 
    setIsLoginModalOpen, 
    loginAdmin, 
    loginMember, 
    navigateTo, 
    members 
  } = useApp();
  
  const [tab, setTab] = useState<'admin' | 'member'>('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [memberIdentifier, setMemberIdentifier] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword.trim()) {
      setErrorMsg('لطفاً رمز عبور را وارد نمایید');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const success = loginAdmin(adminPassword);
      setLoading(false);
      if (success) {
        setAdminPassword('');
        setErrorMsg('');
        setIsLoginModalOpen(false);
        navigateTo('admin');
      } else {
        setErrorMsg('رمز عبور نادرست است (رمزهای معتبر: 123456 یا admin123 یا montazer)');
      }
    }, 200);
  };

  const handleQuickAdminLogin = () => {
    setLoading(true);
    setTimeout(() => {
      loginAdmin('123456');
      setLoading(false);
      setIsLoginModalOpen(false);
      navigateTo('admin');
    }, 150);
  };

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberIdentifier.trim()) {
      setErrorMsg('لطفاً کد ملی، شماره همراه یا شماره عضویت را وارد نمایید');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const success = loginMember(memberIdentifier);
      setLoading(false);
      if (success) {
        setMemberIdentifier('');
        setErrorMsg('');
        setIsLoginModalOpen(false);
      } else {
        setErrorMsg('عضوی با این مشخصات یافت نشد');
      }
    }, 200);
  };

  const handleQuickMemberLogin = (ident: string) => {
    loginMember(ident);
    setIsLoginModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full overflow-hidden"
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-900 p-6 text-white relative">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-amber-300">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold">ورود به سامانه کانون منتظر</h3>
                <p className="text-xs text-sky-100 mt-0.5">مدیریت محتوا، اعضا، کارگاه‌ها و باشگاه نخبگان</p>
              </div>
            </div>

            {/* Switch Tabs */}
            <div className="flex bg-black/20 p-1 rounded-2xl mt-4 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setTab('admin');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                  tab === 'admin'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                ورود مدیران و کادر
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('member');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                  tab === 'member'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                ورود اعضا و دانش‌آموزان
              </button>
            </div>
          </div>

          {/* Form Content */}
          {tab === 'admin' ? (
            <form onSubmit={handleAdminSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  رمز عبور مدیریت
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="رمز عبور (مثلاً 123456 یا admin123)..."
                    className="w-full pr-10 pl-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-sans"
                    autoFocus
                  />
                </div>
                {errorMsg && (
                  <p className="text-xs text-rose-500 font-medium mt-2 flex items-center gap-1">
                    <span>●</span> {errorMsg}
                  </p>
                )}
              </div>

              {/* 1-Click Quick Admin Login Button */}
              <div className="bg-sky-50 dark:bg-sky-950/40 p-3.5 rounded-2xl border border-sky-200 dark:border-sky-800/50 space-y-2">
                <div className="flex items-center justify-between text-xs text-sky-900 dark:text-sky-200">
                  <span className="flex items-center gap-1.5 font-bold">
                    <KeyRound className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    ورود سریع و مستقیم:
                  </span>
                  <button
                    type="button"
                    onClick={handleQuickAdminLogin}
                    className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition font-bold text-xs shadow-sm flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    ورود یک‌کلیکه مدیر
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  رمزهای عبور معتبر: <span className="font-mono font-bold text-sky-600 dark:text-sky-400">123456</span> یا <span className="font-mono font-bold text-sky-600 dark:text-sky-400">admin123</span> یا <span className="font-mono font-bold text-sky-600 dark:text-sky-400">montazer</span>
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 shadow-md shadow-sky-600/20 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>در حال بررسی...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      ورود به پنل مدیریت
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleMemberSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  کد ملی، شماره همراه یا شماره عضویت
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={memberIdentifier}
                    onChange={(e) => {
                      setMemberIdentifier(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="مثلاً 0012345678 یا 09121234567..."
                    className="w-full pr-10 pl-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-sans"
                    autoFocus
                  />
                </div>
                {errorMsg && (
                  <p className="text-xs text-rose-500 font-medium mt-2 flex items-center gap-1">
                    <span>●</span> {errorMsg}
                  </p>
                )}
              </div>

              {/* Sample Members Quick Login */}
              {members.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    ورود تستی با اعضای نمونه ثبت‌شده:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {members.slice(0, 3).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleQuickMemberLogin(m.nationalId)}
                        className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs text-slate-800 dark:text-slate-200 hover:border-sky-500 hover:text-sky-600 transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{m.fullName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 shadow-md shadow-sky-600/20 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>در حال بررسی...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      ورود به حساب عضو
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

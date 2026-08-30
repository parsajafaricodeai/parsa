import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  IdCard,
  Sparkles,
  Search,
  Printer,
  Download,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  User,
  Star,
  Award,
  Calendar,
  Send,
  Upload
} from 'lucide-react';
import { Member } from '../types';

export const MembershipView: React.FC = () => {
  const { members, addMember, findMemberByNumber, showToast, loggedInMember, logoutMember } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMember, setActiveMember] = useState<Member | null>(loggedInMember || members[0] || null);
  const [activeTab, setActiveTab] = useState<'card' | 'register'>('card');

  // React to loggedInMember changes
  React.useEffect(() => {
    if (loggedInMember) {
      setActiveMember(loggedInMember);
    }
  }, [loggedInMember]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    nationalId: '',
    birthDate: '',
    phone: '',
    parentPhone: '',
    schoolGrade: 'پایه هشتم',
    groupUnit: 'واحد شهید مهدی باکری',
    interests: 'رباتیک، سرود، عکاسی',
    skills: 'برنامه‌نویسی، طراحی پوستر',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop'
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = findMemberByNumber(searchQuery);
    if (found) {
      setActiveMember(found);
      setActiveTab('card');
      showToast('پرونده عضویت با موفقیت بارگذاری شد', 'success');
    } else {
      showToast('عضوی با این مشخصات یافت نشد', 'error', 'لطفاً کد ملی یا شماره عضویت را بررسی کنید.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.fatherName || !formData.nationalId || !formData.phone) {
      showToast('لطفاً اطلاعات ستاره‌دار را تکمیل فرمایید', 'warning');
      return;
    }

    const newMem = addMember({
      fullName: formData.fullName,
      fatherName: formData.fatherName,
      nationalId: formData.nationalId,
      birthDate: formData.birthDate || '۱۳۸۸/۰۵/۰۱',
      phone: formData.phone,
      parentPhone: formData.parentPhone,
      schoolGrade: formData.schoolGrade,
      groupUnit: formData.groupUnit,
      interests: formData.interests.split('،').map((s) => s.trim()),
      skills: formData.skills.split('،').map((s) => s.trim()),
      photoUrl: formData.photoUrl
    });

    setActiveMember(newMem);
    setActiveTab('card');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-xs font-bold">
            <IdCard className="w-3.5 h-3.5" />
            <span>باشگاه اعضای کانون نوجوانان منتظر</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">کارت عضویت هوشمند دیجیتال</h1>
          <p className="text-xs sm:text-sm text-amber-100">
            صدور کارت شناسایی دیجیتال، پیگیری امتیازات باشگاه، تخفیف اردوها و دسترسی به امکانات ویژه
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-white/20">
          <button
            onClick={() => setActiveTab('card')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'card' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            <IdCard className="w-3.5 h-3.5" />
            مشاهده و چاپ کارت
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'register' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            ثبت‌نام عضو جدید
          </button>
        </div>
      </div>

      {activeTab === 'card' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Search Box & Member List (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-amber-500" />
                استعلام کارت عضویت
              </h3>
              <form onSubmit={handleSearch} className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="کد ملی، شماره همراه یا کد عضویت..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 text-amber-400 dark:text-slate-950 font-bold text-xs transition"
                >
                  جستجو و استعلام
                </button>
              </form>
            </div>

            {/* Quick Members Picker */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400">
                اعضای نمونه ثبت‌شده در سامانه:
              </h4>
              <div className="space-y-2">
                {members.slice(0, 5).map((mem) => (
                  <button
                    key={mem.id}
                    onClick={() => setActiveMember(mem)}
                    className={`w-full text-right p-3 rounded-xl transition flex items-center justify-between text-xs ${
                      activeMember?.id === mem.id
                        ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={mem.photoUrl}
                        alt={mem.fullName}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div>
                        <p>{mem.fullName}</p>
                        <p className="text-[10px] text-slate-400">{mem.memberNumber}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                      {mem.points} امتیاز
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Digital Card Canvas (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {activeMember ? (
              <div className="space-y-6">
                {/* Printable Digital Card */}
                <div className="print-area bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl border-2 border-amber-500/40 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
                  {/* Glowing background elements */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md">
                        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-amber-400" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                          کانون فرهنگی تربیتی نوجوانان منتظر
                        </h2>
                        <p className="text-[11px] text-amber-300 font-medium">
                          کارت عضویت رسمی و هوشمند باشگاه نخبگان نوجوان
                        </p>
                      </div>
                    </div>

                    <div className="text-left font-mono">
                      <span className="text-[10px] text-slate-400 block">کد شناسایی:</span>
                      <span className="text-xs sm:text-sm font-black text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-600/40">
                        {activeMember.memberNumber}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 relative z-10 items-center">
                    {/* Photo */}
                    <div className="sm:col-span-4 flex flex-col items-center sm:items-start gap-2">
                      <div className="w-32 h-36 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-xl bg-slate-800">
                        <img
                          src={activeMember.photoUrl}
                          alt={activeMember.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="inline-flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/60">
                        <ShieldCheck className="w-3 h-3" />
                        <span>عضویت فعال و معتبر</span>
                      </div>
                    </div>

                    {/* Member Details */}
                    <div className="sm:col-span-8 space-y-3.5 text-xs">
                      <div className="grid grid-cols-2 gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                        <div>
                          <span className="text-[11px] text-slate-400 block">نام و نام خانوادگی:</span>
                          <span className="font-black text-sm text-white">{activeMember.fullName}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 block">نام پدر:</span>
                          <span className="font-bold text-white">{activeMember.fatherName}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 block">کد ملی:</span>
                          <span className="font-mono text-white">{activeMember.nationalId}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 block">پایه تحصیلی:</span>
                          <span className="font-bold text-amber-300">{activeMember.schoolGrade}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[11px] text-slate-400 block">واحد تشکیلاتی کانون:</span>
                          <span className="font-bold text-sky-300">{activeMember.groupUnit}</span>
                        </div>
                      </div>

                      {/* Skills & Points */}
                      <div className="flex items-center justify-between gap-2 px-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                          <Star className="w-4 h-4 text-amber-400 fill-current" />
                          <span>امتیاز باشگاه: <strong className="text-amber-400 font-mono text-xs">{activeMember.points}</strong></span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          تاریخ عضویت: {activeMember.joinedDate}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer with Mock QR Code & Security Stamp */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white p-1 rounded-lg flex items-center justify-center text-slate-950">
                        <QrCode className="w-8 h-8" />
                      </div>
                      <span className="text-[10px] max-w-[200px] leading-tight">
                        اسکن کد جهت تایید اصالت در اردوها و مسابقات
                      </span>
                    </div>

                    <div className="text-left font-bold text-amber-400 text-xs">
                      پایگاه فرهنگی تربیتی منتظر
                    </div>
                  </div>
                </div>

                {/* Print & Action Buttons */}
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={handlePrint}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>چاپ کارت عضویت (نسخه چاپی)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <IdCard className="w-12 h-12 text-slate-300 mx-auto mb-2 stroke-1" />
                <p className="text-sm font-bold">عضوی انتخاب نشده است</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Register New Member Form */
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              فرم ثبت‌نام و صدور کارت عضویت جدید
            </h2>
            <p className="text-xs text-slate-500">
              مشخصات فردی و مهارت‌های خود را وارد کنید تا کارت دیجیتال بلافاصله برای شما صادر شود.
            </p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نام و نام خانوادگی *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="مثال: حسین احمدی"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نام پدر *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  placeholder="مثال: رضا"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  کد ملی *
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={formData.nationalId}
                  onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                  placeholder="۱۰ رقم کد ملی"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  شماره همراه نوجوان *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="۰۹۱۲..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  شماره تماس پدر یا مادر
                </label>
                <input
                  type="tel"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  placeholder="۰۹۱۲..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  پایه تحصیلی
                </label>
                <select
                  value={formData.schoolGrade}
                  onChange={(e) => setFormData({ ...formData, schoolGrade: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                >
                  <option value="پایه هفتم">پایه هفتم</option>
                  <option value="پایه هشتم">پایه هشتم</option>
                  <option value="پایه نهم">پایه نهم</option>
                  <option value="پایه دهم">پایه دهم</option>
                  <option value="پایه یازدهم">پایه یازدهم</option>
                  <option value="پایه دوازدهم">پایه دوازدهم</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  واحد تشکیلاتی کانون
                </label>
                <select
                  value={formData.groupUnit}
                  onChange={(e) => setFormData({ ...formData, groupUnit: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                >
                  <option value="واحد شهید مهدی باکری">واحد شهید مهدی باکری (علمی)</option>
                  <option value="واحد شهید مصطفی احمدی‌روشن">واحد شهید مصطفی احمدی‌روشن (فناوری)</option>
                  <option value="واحد شهید مرتضی آوینی">واحد شهید مرتضی آوینی (رسانه و هنر)</option>
                  <option value="واحد شهید ابراهیم هادی">واحد شهید ابراهیم هادی (تربیت‌بدنی)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  لینک یا آدرس عکس پرسنلی
                </label>
                <input
                  type="text"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-mono"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                علایق و زمینه‌های مورد نظر (با کاما جدا کنید)
              </label>
              <input
                type="text"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                placeholder="مثال: رباتیک، کویرنوردی، تدوین، تواشیح"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>ثبت مشخصات و صدور آنلاین کارت عضویت</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

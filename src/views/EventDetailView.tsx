import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  Compass,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  ListOrdered,
  Send,
  X,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const EventDetailView: React.FC = () => {
  const { selectedId, events, navigateTo, addRegistration, showToast } = useApp();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    phone: '',
    fatherPhone: '',
    birthDate: '',
    schoolGrade: 'پایه نهم',
    notes: ''
  });
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const eventItem = events.find((e) => e.id === selectedId) || events[0];

  if (!eventItem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p>رویداد مورد نظر یافت نشد.</p>
        <button
          onClick={() => navigateTo('events')}
          className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold"
        >
          بازگشت به لیست اردوها
        </button>
      </div>
    );
  }

  const percent = Math.min(100, Math.round((eventItem.registeredCount / eventItem.capacity) * 100));
  const isFull = eventItem.registeredCount >= eventItem.capacity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.fatherPhone || !formData.nationalId) {
      showToast('لطفاً اطلاعات ستاره‌دار را تکمیل نمایید', 'warning');
      return;
    }

    const trackingId = addRegistration({
      type: 'event',
      targetId: eventItem.id,
      targetTitle: eventItem.title,
      fullName: formData.fullName,
      nationalId: formData.nationalId,
      phone: formData.phone,
      fatherPhone: formData.fatherPhone,
      birthDate: formData.birthDate,
      schoolGrade: formData.schoolGrade,
      notes: formData.notes
    });

    setSubmittedCode(trackingId);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigateTo('events')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <ArrowRight className="w-4 h-4" />
        <span>بازگشت به لیست رویدادها و اردوها</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details & Rules */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Compass className="w-4 h-4" />
              <span>{eventItem.type === 'camp' ? 'اردوی تربیتی تفریحی' : 'مسابقه کانون'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {eventItem.title}
            </h1>

            <div className="h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md">
              <img
                src={eventItem.image}
                alt={eventItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                شرح و اهداف برنامه
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-loose">
                {eventItem.description}
              </p>
            </div>

            {/* Required items */}
            {eventItem.requiredItems && eventItem.requiredItems.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-amber-500" />
                  وسایل و ملزومات ضروری به همراه داشتن:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {eventItem.requiredItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rules & Guidelines */}
            {eventItem.rules && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  قوانین و ضوابط حضور:
                </span>
                <p className="text-amber-800 dark:text-amber-300/90 leading-relaxed">
                  {eventItem.rules}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Registration Specs */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs text-slate-500">هزینه ثبت‌نام:</span>
              <span className="text-base font-black text-amber-600 dark:text-amber-400">
                {eventItem.fee}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-500 flex items-center gap-1.5 flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  مقصد / محل:
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-left">
                  {eventItem.destination}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  تاریخ رفت:
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {eventItem.startDate}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-500" />
                  تاریخ بازگشت:
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {eventItem.endDate}
                </span>
              </div>
            </div>

            {/* Capacity */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500">ظرفیت ثبت‌نامی:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {eventItem.registeredCount} از {eventItem.capacity} نفر
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => {
                setSubmittedCode(null);
                setShowRegisterModal(true);
              }}
              disabled={isFull || !eventItem.isRegistrationOpen}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isFull ? 'ظرفیت تکمیل است' : 'پیش‌ثبت‌نام آنلاین اردو'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Registration Modal Form */}
      <AnimatePresence>
        {showRegisterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden my-8"
            >
              <div className="bg-gradient-to-r from-amber-600 to-indigo-900 p-6 text-white relative">
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="absolute top-4 left-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold">فرم پیش‌ثبت‌نام اردو / رویداد</h3>
                <p className="text-xs text-amber-200 mt-1">{eventItem.title}</p>
              </div>

              {submittedCode ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                    پیش‌ثبت‌نام با موفقیت ذخیره شد!
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                    کارشناسان واحد اردو جهت هماهنگی، دریافت مدارک و رضایت‌نامه ولی محترم با شما تماس خواهند گرفت.
                  </p>
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 inline-block font-mono font-black text-xl text-amber-700 dark:text-amber-300">
                    {submittedCode}
                  </div>
                  <div className="pt-3">
                    <button
                      onClick={() => setShowRegisterModal(false)}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
                    >
                      بستن
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        نام و نام خانوادگی نوجوان *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="نام و نام خانوادگی"
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
                        placeholder="کد ملی ۱۰ رقمی"
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
                        شماره تماس ولی (پدر یا مادر) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.fatherPhone}
                        onChange={(e) => setFormData({ ...formData, fatherPhone: e.target.value })}
                        placeholder="۰۹۱۲..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        تاریخ تولد
                      </label>
                      <input
                        type="text"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        placeholder="۱۳۸۸/۰۵/۱۴"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
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
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowRegisterModal(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      تایید و ارسال پیش‌ثبت‌نام
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

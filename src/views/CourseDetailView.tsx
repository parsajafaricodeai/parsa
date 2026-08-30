import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  GraduationCap,
  Clock,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  Send,
  X,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CourseDetailView: React.FC = () => {
  const { selectedId, courses, navigateTo, addRegistration, showToast } = useApp();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    phone: '',
    fatherPhone: '',
    birthDate: '',
    schoolGrade: 'پایه هشتم',
    notes: ''
  });
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const course = courses.find((c) => c.id === selectedId) || courses[0];

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p>دوره مورد نظر یافت نشد.</p>
        <button
          onClick={() => navigateTo('courses')}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          بازگشت به لیست دوره‌ها
        </button>
      </div>
    );
  }

  const isFull = course.enrolledCount >= course.capacity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.fatherPhone || !formData.nationalId) {
      showToast('لطفاً تمامی فیلدهای الزامی را تکمیل نمایید', 'warning');
      return;
    }

    const trackingId = addRegistration({
      type: 'course',
      targetId: course.id,
      targetTitle: course.title,
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
        onClick={() => navigateTo('courses')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <ArrowRight className="w-4 h-4" />
        <span>بازگشت به لیست دوره‌ها</span>
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details & Syllabus */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="w-4 h-4" />
              <span>{course.category.replace('_', ' ')}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {course.title}
            </h1>

            <div className="h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                توضیحات و اهداف آموزشی دوره
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-loose">
                {course.description}
              </p>
            </div>

            {/* Prerequisites */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
                <AlertCircle className="w-4 h-4" />
                پیش‌نیازها و ملزومات:
              </span>
              <p className="text-slate-600 dark:text-slate-400">{course.requirements}</p>
            </div>

            {/* Syllabus */}
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                سرفصل‌های آموزشی جلسات
              </h3>
              <div className="space-y-2.5">
                {course.syllabus.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs"
                  >
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      {index + 1}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 pt-0.5 leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Sticky Enrollment Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs text-slate-500">شهریه دوره:</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {course.fee}
              </span>
            </div>

            {/* Key Specs */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  مدرس دوره:
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {course.instructor}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  مدت آموزش:
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {course.duration}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  زمان برگزاری:
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {course.schedule}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">رده سنی مجاز:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {course.ageGroup}
                </span>
              </div>
            </div>

            {/* Capacity progress */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500">وضعیت ظرفیت:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {course.enrolledCount} از {course.capacity} نفر
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isFull ? 'bg-rose-500' : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (course.enrolledCount / course.capacity) * 100)}%`
                  }}
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                setSubmittedCode(null);
                setShowRegisterModal(true);
              }}
              disabled={isFull}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isFull ? 'ظرفیت تکمیل است' : 'ثبت‌نام آنلاین در این دوره'}</span>
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              پس از ثبت‌نام، شماره پیگیری صادر شده و کارشناسان کانون جهت هماهنگی تماس خواهند گرفت.
            </p>
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
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-6 text-white relative">
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="absolute top-4 left-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold">فرم ثبت‌نام در دوره آموزشی</h3>
                <p className="text-xs text-teal-100 mt-1">{course.title}</p>
              </div>

              {submittedCode ? (
                /* Success State */
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                    ثبت‌نام شما با موفقیت ثبت شد!
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                    اطلاعات شما در سامانه کانون ذخیره شد. کد پیگیری خود را جهت مراجعات بعدی یادداشت فرمایید.
                  </p>
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 inline-block font-mono font-black text-xl text-emerald-700 dark:text-emerald-300">
                    {submittedCode}
                  </div>
                  <div className="pt-3">
                    <button
                      onClick={() => setShowRegisterModal(false)}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
                    >
                      بستن پنجره
                    </button>
                  </div>
                </div>
              ) : (
                /* Form */
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
                        placeholder="مثال: علیرضا محمدی"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        شماره تماس نوجوان *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
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
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
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
                        placeholder="مثال: ۱۳۸۸/۰۵/۱۴"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        پایه تحصیلی
                      </label>
                      <select
                        value={formData.schoolGrade}
                        onChange={(e) => setFormData({ ...formData, schoolGrade: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
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

                  <div className="text-xs">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      توضیحات یا سوابق قبلی (اختیاری)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="اگر سابقه یا مهارت قبلی دارید بنویسید..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                    />
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
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      تایید و ارسال ثبت‌نام
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

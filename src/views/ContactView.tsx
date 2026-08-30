import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  MessageSquare,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { siteSettings, addMessage } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'شرایط ثبت‌نام و عضویت در کانون نوجوانان منتظر چیست؟',
      a: 'عضویت در کانون برای تمام نوجوانان ۱۱ الی ۱۸ سال کاملاً رایگان است. کافیست از بخش «کارت عضویت» در سایت ثبت‌نام نمایید تا کارت دیجیتال و کد عضویت صادر گردد.'
    },
    {
      q: 'آیا برای شرکت در کلاس‌های رباتیک و رسانه نیاز به پیش‌نیاز قبلی هست؟',
      a: 'خیر، کلیه دوره‌های آموزشی از سطح مقدماتی و پایه آموزش داده می‌شوند و بسته‌های قطعات و ملزومات در محل کارگاه کانون در اختیار هنرجویان قرار می‌گیرد.'
    },
    {
      q: 'اردوهای کانون چگونه برگزار می‌شود و آیا امنیت و اسکان تضمین‌شده است؟',
      a: 'تمام اردوها با بیمه کامل حوادث، همراهی مربیان باسابقه و تاییدیه رسمی برگزار می‌شود و رضایت‌نامه کتبی والدین قبل از اعزام اخذ می‌گردد.'
    },
    {
      q: 'ساعات فعالیت کانون و پاسخگویی حضوری چه زمان‌هایی است؟',
      a: 'کانون همه روزه (به جز جمعه‌ها) از ساعت ۱۴:۰۰ الی ۲۰:۰۰ و پنج‌شنبه‌ها از ساعت ۹:۰۰ الی ۱۸:۰۰ دایر می‌باشد.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return;
    addMessage({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      subject: formData.subject || 'پیام از سایت',
      message: formData.message
    });
    setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-800 via-indigo-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>پل ارتباطی با مسئولین و مربیان</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">تماس با ما و ثبت نظرات</h1>
          <p className="text-xs sm:text-sm text-sky-200">
            انتقادات، پیشنهادات، سوالات پیرامون دوره‌ها و پیام‌های خود را با ما در میان بگذارید
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info & Channels (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              نشانی و راه‌های ارتباطی کانون
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">آدرس مجتمع:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {siteSettings.contactAddress}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">تلفن‌های تماس:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {siteSettings.phone1} - {siteSettings.phone2}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">رایانامه رسمی:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {siteSettings.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">ساعات کاری:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    شنبه تا چهارشنبه ۱۴ الی ۲۰ | پنج‌شنبه‌ها ۹ الی ۱۸
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Messenger Buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                کانال‌ها و پشتیبانی در پیام‌رسان‌ها:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href={siteSettings.socialLinks.eitaa}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 font-bold text-center hover:opacity-90 transition"
                >
                  کانال ایتا
                </a>
                <a
                  href={siteSettings.socialLinks.bale}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-center hover:opacity-90 transition"
                >
                  پیام‌رسان بله
                </a>
                <a
                  href={siteSettings.socialLinks.rubika}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold text-center hover:opacity-90 transition"
                >
                  کانال روبیکا
                </a>
                <a
                  href={siteSettings.socialLinks.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-bold text-center hover:opacity-90 transition"
                >
                  کانال تلگرام
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              ارسال پیام مستقیم به مدیریت کانون
            </h3>
            <p className="text-xs text-slate-500">
              پیام شما بلافاصله در سامانه ثبت شده و پاسخ آن از طریق پیامک یا تماس اعلام خواهد شد.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نام و نام خانوادگی *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="نام شما"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-sans"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  شماره تماس همراه *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  پست الکترونیک (اختیاری)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@mail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  موضوع پیام
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="مثال: سوال درباره کلاس‌های رباتیک"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-sans"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                متن پیام شما *
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="پیام، نظر یا پیشنهاد خود را اینجا بنویسید..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-sky-600/20 transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>ارسال پیام به کانون</span>
            </button>
          </form>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          پرسش‌های متداول والدین و نوجوانان (FAQ)
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-right flex items-center justify-between font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-sky-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

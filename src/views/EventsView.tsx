import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  CheckCircle2,
  Tag
} from 'lucide-react';

export const EventsView: React.FC = () => {
  const { events, navigateTo } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredEvents = events.filter((e) => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-950 to-slate-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>واحد اردوها و برنامه‌های تربیتی کانون</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">اردوها، گردهمایی‌ها و مسابقات</h1>
          <p className="text-xs sm:text-sm text-indigo-200">
            سفرهای زیارتی، اردوهای تفریحی و جهادی، رصد ستارگان و رقابت‌های هیجان‌انگیز گروهی
          </p>
        </div>

        {/* Quick Filter */}
        <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/20">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterType === 'all' ? 'bg-amber-500 text-slate-950 shadow' : 'text-white hover:bg-white/10'
            }`}
          >
            همه رویدادها
          </button>
          <button
            onClick={() => setFilterType('camp')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterType === 'camp' ? 'bg-amber-500 text-slate-950 shadow' : 'text-white hover:bg-white/10'
            }`}
          >
            اردوها
          </button>
          <button
            onClick={() => setFilterType('competition')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterType === 'competition' ? 'bg-amber-500 text-slate-950 shadow' : 'text-white hover:bg-white/10'
            }`}
          >
            مسابقات
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((ev) => {
          const percent = Math.min(100, Math.round((ev.registeredCount / ev.capacity) * 100));
          return (
            <div
              key={ev.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
            >
              <div className="relative h-60 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                  {ev.type === 'camp' ? 'اردوی تفریحی زیارتی' : 'مسابقه و چالش'}
                </div>
                <div className="absolute bottom-3 left-3 bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-lg shadow-md">
                  {ev.fee}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 text-xs text-amber-600 dark:text-amber-400 font-bold mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {ev.startDate} الی {ev.endDate}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 truncate max-w-[200px]">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      {ev.destination}
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {ev.registeredCount} از {ev.capacity} نفر ({percent}٪)
                    </span>
                  </div>

                  <button
                    onClick={() => navigateTo('event-detail', ev.id)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-1.5"
                  >
                    <span>مشاهده جزییات اردو و پیش‌ثبت‌نام</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

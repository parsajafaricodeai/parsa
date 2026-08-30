import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  Compass,
  IdCard,
  Image as ImageIcon,
  Music,
  Inbox,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Users,
  Search,
  Download,
  Printer,
  ChevronRight,
  TrendingUp,
  Save,
  Tag,
  AlertTriangle,
  Upload,
  Video,
  Film,
  Link2,
  FileVideo,
  FileAudio,
  Check,
  RefreshCw
} from 'lucide-react';
import { Article, Course, EventItem, Member, MediaItem, AudioTrack, Registration } from '../types';
import { SmartVideoPlayer } from '../components/SmartVideoPlayer';
import {
  parseVideoUrl,
  formatBytes
} from '../utils/mediaUtils';
import {
  saveMediaToIndexedDB,
  generateFastVideoThumbnail,
  ResolvedImage,
  getStorageStats
} from '../utils/indexedDBStorage';

type AdminTab =
  | 'overview'
  | 'articles'
  | 'courses'
  | 'events'
  | 'registrations'
  | 'members'
  | 'media'
  | 'audio'
  | 'messages'
  | 'settings';

export const AdminDashboard: React.FC = () => {
  const {
    adminUser,
    logoutAdmin,
    navigateTo,
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    registrations,
    updateRegistrationStatus,
    members,
    addMember,
    updateMemberPoints,
    deleteMember,
    mediaList,
    addMedia,
    deleteMedia,
    audioTracks,
    addAudioTrack,
    deleteAudioTrack,
    messages,
    markMessageRead,
    deleteMessage,
    siteSettings,
    updateSiteSettings,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Modal / Form States
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<EventItem> | null>(null);
  const [newAudio, setNewAudio] = useState({ title: '', singer: '', url: '', duration: '' });
  const [audioUploadMode, setAudioUploadMode] = useState<'link' | 'file'>('file');
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [uploadedAudioInfo, setUploadedAudioInfo] = useState<{ name: string; size: string } | null>(null);

  const [newMedia, setNewMedia] = useState<{
    title: string;
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
    category: string;
    description: string;
  }>({
    title: '',
    type: 'video',
    url: '',
    thumbnail: '',
    category: 'علمی',
    description: ''
  });
  const [mediaUploadMode, setMediaUploadMode] = useState<'file' | 'link'>('file');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [mediaUploadProgress, setMediaUploadProgress] = useState(0);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{ name: string; size: string } | null>(null);

  const mediaFileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  // Settings State
  const [settingsForm, setSettingsForm] = useState(siteSettings);

  const stats = [
    { label: 'مقالات و اخبار', count: articles.length, icon: FileText, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/60' },
    { label: 'دوره‌های فعال', count: courses.length, icon: GraduationCap, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60' },
    { label: 'اردوها و رویدادها', count: events.length, icon: Compass, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60' },
    { label: 'ثبت‌نام‌های آنلاین', count: registrations.length, icon: Clock, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60' },
    { label: 'اعضای رسمی باشگاه', count: members.length, icon: IdCard, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60' },
    { label: 'پیام‌های دریافتی', count: messages.filter((m) => !m.isRead).length, icon: Inbox, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60' }
  ];

  // Article Save Handler
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle?.title || !editingArticle?.excerpt) return;

    if (editingArticle.id) {
      updateArticle(editingArticle.id, editingArticle);
    } else {
      addArticle({
        title: editingArticle.title,
        slug: editingArticle.title.toLowerCase().replace(/\s+/g, '-'),
        excerpt: editingArticle.excerpt,
        content: editingArticle.content || '<p>متن کامل مقاله...</p>',
        coverImage: editingArticle.coverImage || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
        category: editingArticle.category || 'فرهنگی',
        tags: editingArticle.tags || ['کانون', 'نوجوانان'],
        author: editingArticle.author || adminUser?.name || 'مدیر کانون',
        isFeatured: editingArticle.isFeatured || false
      });
    }
    setEditingArticle(null);
  };

  // Course Save Handler
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse?.title || !editingCourse?.instructor) return;

    if (editingCourse.id) {
      updateCourse(editingCourse.id, editingCourse);
    } else {
      addCourse({
        title: editingCourse.title,
        description: editingCourse.description || '',
        category: editingCourse.category || 'علمی_مهندسی',
        instructor: editingCourse.instructor,
        schedule: editingCourse.schedule || 'شنبه‌ها و چهارشنبه‌ها',
        duration: editingCourse.duration || '۱۰ جلسه',
        ageGroup: editingCourse.ageGroup || '۱۲ الی ۱۶ سال',
        capacity: editingCourse.capacity || 20,
        enrolledCount: 0,
        fee: editingCourse.fee || 'رایگان',
        image: editingCourse.image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop',
        requirements: editingCourse.requirements || 'علاقه به یادگیری',
        syllabus: editingCourse.syllabus || ['جلسه اول: آشنایی', 'جلسه دوم: مبانی']
      });
    }
    setEditingCourse(null);
  };

  // Event Save Handler
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent?.title || !editingEvent?.destination) return;

    if (editingEvent.id) {
      updateEvent(editingEvent.id, editingEvent);
    } else {
      addEvent({
        title: editingEvent.title,
        type: editingEvent.type || 'camp',
        description: editingEvent.description || '',
        destination: editingEvent.destination,
        startDate: editingEvent.startDate || '۱۴۰۳/۰۶/۱۰',
        endDate: editingEvent.endDate || '۱۴۰۳/۰۶/۱۵',
        capacity: editingEvent.capacity || 40,
        registeredCount: 0,
        fee: editingEvent.fee || 'رایگان',
        image: editingEvent.image || 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=800&auto=format&fit=crop',
        requiredItems: editingEvent.requiredItems || ['کفش مناسب', 'کوله پشتی'],
        rules: editingEvent.rules || 'رعایت نظم و همراه داشتن رضایت‌نامه ولی.',
        isRegistrationOpen: true
      });
    }
    setEditingEvent(null);
  };

  const [storageStats, setStorageStats] = useState<{ count: number; formattedSize: string }>({ count: 0, formattedSize: '۰ بایت' });

  // Update storage stats whenever media tab is active or mediaList changes
  useEffect(() => {
    getStorageStats().then((stats) => {
      setStorageStats({ count: stats.count, formattedSize: stats.formattedSize });
    });
  }, [activeTab, mediaList.length, audioTracks.length]);

  const handleMediaFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingMedia(true);
      setMediaUploadProgress(15);

      const isVideoFile = file.type.startsWith('video/') || Boolean(file.name.match(/\.(mp4|webm|mov|mkv|avi|m4v)$/i));
      const targetType = isVideoFile ? 'video' : 'image';

      setUploadedFileInfo({
        name: file.name,
        size: formatBytes(file.size)
      });

      // If title is empty, set from file name
      const titleFromFile = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      if (!newMedia.title) {
        setNewMedia((prev) => ({ ...prev, title: titleFromFile }));
      }

      setMediaUploadProgress(40);

      // Save directly to IndexedDB as binary blob without creating huge base64 in memory
      const saved = await saveMediaToIndexedDB(file);
      setMediaUploadProgress(75);

      let capturedThumb = '';
      if (isVideoFile) {
        // Fast non-blocking video thumbnail extraction
        capturedThumb = await generateFastVideoThumbnail(file);
      }

      setNewMedia((prev) => ({
        ...prev,
        type: targetType,
        url: saved.idbUrl,
        thumbnail: capturedThumb || prev.thumbnail || '',
        title: prev.title || titleFromFile
      }));

      setMediaUploadProgress(100);
      showToast(`${isVideoFile ? 'ویدیو' : 'تصویر'} با موفقیت و بدون فریز ذخیره شد.`, 'success');
      
      // Refresh storage stats
      getStorageStats().then((stats) => {
        setStorageStats({ count: stats.count, formattedSize: stats.formattedSize });
      });
    } catch (err) {
      console.error('File upload error:', err);
      showToast('خطا در ذخیره‌سازی فایل در حافظه.', 'error');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingAudio(true);
      setUploadedAudioInfo({
        name: file.name,
        size: formatBytes(file.size)
      });

      const titleFromFile = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const saved = await saveMediaToIndexedDB(file);

      setNewAudio((prev) => ({
        ...prev,
        title: prev.title || titleFromFile,
        url: saved.idbUrl,
        duration: prev.duration || '۰۳:۳۰'
      }));

      showToast('فایل صوتی با موفقیت ذخیره شد.', 'success');

      // Refresh storage stats
      getStorageStats().then((stats) => {
        setStorageStats({ count: stats.count, formattedSize: stats.formattedSize });
      });
    } catch (err) {
      console.error('Audio upload error:', err);
      showToast('خطا در ذخیره‌سازی فایل صوتی.', 'error');
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const handleAddAudio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAudio.title || !newAudio.url) {
      showToast('لطفاً عنوان و فایل/لینک صوتی را وارد نمایید.', 'error');
      return;
    }
    addAudioTrack({
      title: newAudio.title,
      singer: newAudio.singer || 'گروه سرود کانون منتظر',
      url: newAudio.url,
      duration: newAudio.duration || '۰۳:۴۵'
    });
    setNewAudio({ title: '', singer: '', url: '', duration: '' });
    setUploadedAudioInfo(null);
    showToast('ترک صوتی با موفقیت به پلیر اضافه شد.', 'success');
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedia.title || !newMedia.url) {
      showToast('لطفاً عنوان و ویدیو یا تصویر را مشخص کنید.', 'error');
      return;
    }
    addMedia({
      title: newMedia.title,
      type: newMedia.type,
      url: newMedia.url,
      thumbnail: newMedia.thumbnail,
      category: newMedia.category,
      description: newMedia.description,
      date: 'شهریور ۱۴۰۳'
    });
    setNewMedia({ title: '', type: 'video', url: '', thumbnail: '', category: 'علمی', description: '' });
    setUploadedFileInfo(null);
    showToast('رسانه جدید با موفقیت به گالری افزوده شد.', 'success');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(settingsForm);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col justify-between border-l border-slate-800">
        <div>
          {/* Admin Info Header */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-md">
                {adminUser?.username?.slice(0, 1).toUpperCase() || 'A'}
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">{adminUser?.name || 'مدیر سامانه'}</h3>
                <p className="text-[11px] text-amber-400 font-mono">سطح دسترسی: مدیر کل</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs">
            {[
              { id: 'overview', label: 'داشبورد و آمار', icon: LayoutDashboard },
              { id: 'articles', label: 'مدیریت مقالات و اخبار', icon: FileText },
              { id: 'courses', label: 'دوره‌های آموزشی', icon: GraduationCap },
              { id: 'events', label: 'اردوها و رویدادها', icon: Compass },
              { id: 'registrations', label: 'ثبت‌نام‌های آنلاین', icon: Clock, count: registrations.length },
              { id: 'members', label: 'باشگاه و کارت اعضا', icon: IdCard },
              { id: 'media', label: 'رسانه‌خانه و گالری', icon: ImageIcon },
              { id: 'audio', label: 'نوای صوتی و سرودها', icon: Music },
              { id: 'messages', label: 'پیام‌های دریافتی', icon: Inbox, count: messages.filter((m) => !m.isRead).length },
              { id: 'settings', label: 'تنظیمات کلی سامانه', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      isActive ? 'bg-slate-950 text-white' : 'bg-slate-800 text-amber-400'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => navigateTo('home')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4 text-sky-400" />
            <span>مشاهده پرتال عمومی</span>
          </button>

          <button
            onClick={() => {
              logoutAdmin();
              navigateTo('home');
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition flex items-center justify-center gap-2 border border-rose-500/30"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج از پنل مدیریت</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-h-screen">
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                داشبورد مدیریت کانون نوجوانان منتظر
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                خلاصه وضعیت محتوا، کارگاه‌ها، ثبت‌نامی‌ها و ارتباطات
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {stats.map((st, idx) => {
                const Icon = st.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {st.label}
                      </span>
                      <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                        {st.count}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${st.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Registrations Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  آخرین درخواست‌های ثبت‌نام آنلاین
                </h3>
                <button
                  onClick={() => setActiveTab('registrations')}
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  مشاهده همه ({registrations.length})
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                      <th className="pb-3 font-bold">کد پیگیری</th>
                      <th className="pb-3 font-bold">نام متقاضی</th>
                      <th className="pb-3 font-bold">نوع و عنوان</th>
                      <th className="pb-3 font-bold">تلفن همراه</th>
                      <th className="pb-3 font-bold">تاریخ ثبت</th>
                      <th className="pb-3 font-bold">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {registrations.slice(0, 5).map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                          {reg.id}
                        </td>
                        <td className="py-3 font-bold text-slate-900 dark:text-white">
                          {reg.fullName}
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-400">
                          {reg.targetTitle} ({reg.type === 'course' ? 'دوره' : 'اردو'})
                        </td>
                        <td className="py-3 font-mono text-slate-600 dark:text-slate-400">
                          {reg.phone}
                        </td>
                        <td className="py-3 text-slate-400">{reg.createdAt}</td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              reg.status === 'approved'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                                : reg.status === 'rejected'
                                ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                            }`}
                          >
                            {reg.status === 'approved' ? 'تایید شده' : reg.status === 'rejected' ? 'رد شده' : 'در انتظار بررسی'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ARTICLES CMS ================= */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  مدیریت مقالات، اخبار و گزارش‌ها
                </h2>
                <p className="text-xs text-slate-500">ایجاد، ویرایش و انتشار محتوای رسانه‌ای</p>
              </div>

              <button
                onClick={() =>
                  setEditingArticle({
                    title: '',
                    excerpt: '',
                    content: '',
                    category: 'فرهنگی',
                    coverImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
                    tags: ['کانون'],
                    isFeatured: false
                  })
                }
                className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن مقاله جدید</span>
              </button>
            </div>

            {/* Editor Modal / Inline Form */}
            {editingArticle && (
              <form
                onSubmit={handleSaveArticle}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-sky-500 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {editingArticle.id ? 'ویرایش مقاله' : 'انتشار مقاله جدید در سایت'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingArticle(null)}
                    className="text-xs text-slate-400 hover:text-rose-500"
                  >
                    انصراف
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1">عنوان مقاله *</label>
                    <input
                      type="text"
                      required
                      value={editingArticle.title || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                      placeholder="عنوان خبر یا مقاله..."
                      className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">دسته‌بندی موضوعی</label>
                    <select
                      value={editingArticle.category || 'فرهنگی'}
                      onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="فرهنگی">فرهنگی</option>
                      <option value="مذهبی">مذهبی</option>
                      <option value="علمی_رباتیک">علمی و رباتیک</option>
                      <option value="اردویی_ورزشی">اردویی و ورزشی</option>
                      <option value="سرود_هنر">سرود و هنر</option>
                      <option value="اطلاعیه">اطلاعیه رسمی</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1">خلاصه کوتاه (Excerpt) *</label>
                    <textarea
                      rows={2}
                      required
                      value={editingArticle.excerpt || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                      placeholder="چکیده کوتاه مقاله جهت نمایش در کارت‌ها..."
                      className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1">متن کامل (پشتیبانی از HTML / پاراگراف‌ها) *</label>
                    <textarea
                      rows={6}
                      required
                      value={editingArticle.content || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                      placeholder="<p>متن کامل مقاله...</p>"
                      className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">آدرس عکس کاور (Cover URL)</label>
                    <input
                      type="text"
                      value={editingArticle.coverImage || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, coverImage: e.target.value })}
                      className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={editingArticle.isFeatured || false}
                        onChange={(e) => setEditingArticle({ ...editingArticle, isFeatured: e.target.checked })}
                        className="rounded"
                      />
                      <span>نمایش به عنوان مطلب ویژه در صفحه اصلی</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs"
                  >
                    ذخیره و انتشار
                  </button>
                </div>
              </form>
            )}

            {/* Articles List Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                    <th className="pb-3">تصویر</th>
                    <th className="pb-3">عنوان مقاله</th>
                    <th className="pb-3">دسته</th>
                    <th className="pb-3">بازدید</th>
                    <th className="pb-3">تاریخ</th>
                    <th className="pb-3">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {articles.map((art) => (
                    <tr key={art.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3">
                        <img src={art.coverImage} alt={art.title} className="w-12 h-10 object-cover rounded-lg" />
                      </td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                        {art.title}
                        {art.isFeatured && (
                          <span className="mr-2 text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black">
                            ویژه
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-slate-500">{art.category.replace('_', ' ')}</td>
                      <td className="py-3 font-mono">{art.views}</td>
                      <td className="py-3 text-slate-400">{art.publishedAt}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingArticle(art)}
                            className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 hover:bg-sky-100"
                            title="ویرایش"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('آیا از حذف این مقاله اطمینان دارید؟')) {
                                deleteArticle(art.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 hover:bg-rose-100"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: COURSES ================= */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  مدیریت کارگاه‌ها و دوره‌های آموزشی
                </h2>
                <p className="text-xs text-slate-500">تعریف مدرسین، ظرفیت‌ها و زمان‌بندی جلسات</p>
              </div>

              <button
                onClick={() =>
                  setEditingCourse({
                    title: '',
                    instructor: '',
                    category: 'علمی_مهندسی',
                    capacity: 20,
                    fee: 'رایگان',
                    schedule: 'دوشنبه‌ها ۱۶:۰۰',
                    duration: '۸ جلسه',
                    ageGroup: '۱۲ الی ۱۶ سال',
                    description: '',
                    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop'
                  })
                }
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن دوره آموزشی جدید</span>
              </button>
            </div>

            {editingCourse && (
              <form
                onSubmit={handleSaveCourse}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-emerald-500 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {editingCourse.id ? 'ویرایش دوره' : 'تعریف دوره جدید'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingCourse(null)}
                    className="text-xs text-slate-400 hover:text-rose-500"
                  >
                    انصراف
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1">عنوان دوره *</label>
                    <input
                      type="text"
                      required
                      value={editingCourse.title || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                      className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">نام استاد / مربی *</label>
                    <input
                      type="text"
                      required
                      value={editingCourse.instructor || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
                      className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">دسته‌بندی</label>
                    <select
                      value={editingCourse.category || 'علمی_مهندسی'}
                      onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="علمی_مهندسی">علمی و مهندسی</option>
                      <option value="قرآنی_معارفی">قرآنی و معارفی</option>
                      <option value="هنر_رسانه">هنر و رسانه</option>
                      <option value="ورزشی_مهارتی">ورزشی و مهارتی</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">ظرفیت (نفر)</label>
                    <input
                      type="number"
                      value={editingCourse.capacity || 20}
                      onChange={(e) => setEditingCourse({ ...editingCourse, capacity: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">شهریه</label>
                    <input
                      type="text"
                      value={editingCourse.fee || 'رایگان'}
                      onChange={(e) => setEditingCourse({ ...editingCourse, fee: e.target.value })}
                      className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">زمان‌بندی جلسات</label>
                    <input
                      type="text"
                      value={editingCourse.schedule || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, schedule: e.target.value })}
                      className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block font-bold mb-1">توضیحات دوره</label>
                    <textarea
                      rows={3}
                      value={editingCourse.description || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                      className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                  >
                    ذخیره دوره
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img src={c.image} alt={c.title} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{c.title}</h4>
                      <p className="text-xs text-slate-500">
                        مدرس: {c.instructor} | ثبت‌نامی: {c.enrolledCount} از {c.capacity} نفر
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingCourse(c)}
                      className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('دوره حذف شود؟')) deleteCourse(c.id);
                      }}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: EVENTS ================= */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  مدیریت اردوها و رویدادها
                </h2>
                <p className="text-xs text-slate-500">برنامه‌ریزی سفرهای زیارتی و مسابقات کانون</p>
              </div>

              <button
                onClick={() =>
                  setEditingEvent({
                    title: '',
                    type: 'camp',
                    destination: '',
                    startDate: '۱۴۰۳/۰۶/۱۰',
                    endDate: '۱۴۰۳/۰۶/۱۵',
                    capacity: 40,
                    fee: 'رایگان',
                    description: '',
                    rules: 'همراه داشتن رضایت‌نامه ولی الزامی است.',
                    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=800&auto=format&fit=crop'
                  })
                }
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>تعریف اردو / رویداد جدید</span>
              </button>
            </div>

            {editingEvent && (
              <form
                onSubmit={handleSaveEvent}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-amber-500 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {editingEvent.id ? 'ویرایش رویداد' : 'افزودن برنامه جدید'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="text-xs text-slate-400 hover:text-rose-500"
                  >
                    انصراف
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1">عنوان برنامه *</label>
                    <input
                      type="text"
                      required
                      value={editingEvent.title || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                      className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">مقصد / محل برگزاری *</label>
                    <input
                      type="text"
                      required
                      value={editingEvent.destination || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, destination: e.target.value })}
                      className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">نوع برنامه</label>
                    <select
                      value={editingEvent.type || 'camp'}
                      onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="camp">اردوی تفریحی و زیارتی</option>
                      <option value="competition">مسابقه و چالش</option>
                      <option value="workshop">کارگاه یک‌روزه</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">ظرفیت (نفر)</label>
                    <input
                      type="number"
                      value={editingEvent.capacity || 40}
                      onChange={(e) => setEditingEvent({ ...editingEvent, capacity: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">تاریخ رفت</label>
                    <input
                      type="text"
                      value={editingEvent.startDate || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, startDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">تاریخ برگشت</label>
                    <input
                      type="text"
                      value={editingEvent.endDate || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, endDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    ذخیره رویداد
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img src={ev.image} alt={ev.title} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ev.title}</h4>
                      <p className="text-xs text-slate-500">
                        مقصد: {ev.destination} | {ev.registeredCount} از {ev.capacity} نفر
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingEvent(ev)}
                      className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('رویداد حذف شود؟')) deleteEvent(ev.id);
                      }}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: REGISTRATIONS ================= */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  مدیریت و تایید ثبت‌نام‌های آنلاین
                </h2>
                <p className="text-xs text-slate-500">
                  بررسی متقاضیان دوره‌ها و اردوها، تایید وضعیت و صدور تاییدیه
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>چاپ لیست متقاضیان</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                    <th className="pb-3">کد پیگیری</th>
                    <th className="pb-3">نام نوجوان</th>
                    <th className="pb-3">کد ملی</th>
                    <th className="pb-3">تلفن نوجوان / ولی</th>
                    <th className="pb-3">عنوان دوره یا اردو</th>
                    <th className="pb-3">وضعیت</th>
                    <th className="pb-3">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                        {reg.id}
                      </td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">
                        {reg.fullName}
                      </td>
                      <td className="py-3 font-mono">{reg.nationalId}</td>
                      <td className="py-3 font-mono">
                        {reg.phone} <span className="text-slate-400">/</span> {reg.fatherPhone}
                      </td>
                      <td className="py-3">{reg.targetTitle}</td>
                      <td className="py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            reg.status === 'approved'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                              : reg.status === 'rejected'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                          }`}
                        >
                          {reg.status === 'approved' ? 'تایید شده' : reg.status === 'rejected' ? 'رد شده' : 'در انتظار بررسی'}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateRegistrationStatus(reg.id, 'approved')}
                            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 hover:bg-emerald-100"
                            title="تایید ثبت‌نام"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateRegistrationStatus(reg.id, 'rejected')}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 hover:bg-rose-100"
                            title="رد درخواست"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 6: MEMBERS ================= */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  فهرست و سوابق اعضای باشگاه نوجوانان
                </h2>
                <p className="text-xs text-slate-500">
                  امتیازدهی، ویرایش مشخصات، صدور کارت و پیگیری فعالیت‌ها
                </p>
              </div>

              <button
                onClick={() => navigateTo('membership')}
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>ثبت عضویت جدید</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                    <th className="pb-3">تصویر</th>
                    <th className="pb-3">شماره کارت</th>
                    <th className="pb-3">نام و نام خانوادگی</th>
                    <th className="pb-3">نام پدر</th>
                    <th className="pb-3">کد ملی</th>
                    <th className="pb-3">واحد تشکیلاتی</th>
                    <th className="pb-3">امتیاز باشگاه</th>
                    <th className="pb-3">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {members.map((mem) => (
                    <tr key={mem.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3">
                        <img src={mem.photoUrl} alt={mem.fullName} className="w-9 h-9 rounded-lg object-cover" />
                      </td>
                      <td className="py-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                        {mem.memberNumber}
                      </td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">
                        {mem.fullName}
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">{mem.fatherName}</td>
                      <td className="py-3 font-mono">{mem.nationalId}</td>
                      <td className="py-3 text-sky-600 dark:text-sky-400">{mem.groupUnit}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateMemberPoints(mem.id, mem.points + 10)}
                            className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 font-bold"
                          >
                            +۱۰
                          </button>
                          <span className="font-mono font-bold px-2">{mem.points}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => {
                            if (confirm('عضو حذف شود؟')) deleteMember(mem.id);
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 hover:bg-rose-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 7: MEDIA ================= */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  مدیریت رسانه‌خانه و ویدیوها
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <p className="text-xs text-slate-500">
                    بارگذاری سریع ویدیو با موتور دیتابیس محلی (IndexedDB) بدون فریز مرورگر
                  </p>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>حافظه محلی: {storageStats.formattedSize} ({storageStats.count} فایل)</span>
                  </span>
                </div>
              </div>

              {/* Sample Presets */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setNewMedia({
                      title: 'کلیپ سرود آینده‌سازان کانون (آپارات)',
                      type: 'video',
                      url: 'https://www.aparat.com/v/w950130',
                      category: 'سرود',
                      description: 'پخش اختصاصی از کانال آپارات کانون منتظر'
                    });
                    setMediaUploadMode('link');
                    showToast('نمونه ویدیوی آپارات در فرم قرار گرفت.', 'info');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100 transition"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>تست ویدیو آپارات</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewMedia({
                      title: 'تیزر مسابقات رباتیک (فایل مستقیم MP4)',
                      type: 'video',
                      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                      category: 'علمی',
                      description: 'نمونه ویدیو با فرمت مستقیم MP4 و پخش آنلاین'
                    });
                    setMediaUploadMode('link');
                    showToast('نمونه فایل مستقیم ویدیویی در فرم قرار گرفت.', 'info');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-bold flex items-center gap-1.5 hover:bg-sky-100 transition"
                >
                  <FileVideo className="w-3.5 h-3.5" />
                  <span>تست فایل MP4 مستقیم</span>
                </button>
              </div>
            </div>

            {/* Upload / Add Media Box */}
            <form onSubmit={handleAddMedia} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-sky-500" />
                  <span>افزودن و بارگذاری رسانه جدید (ویدیو / عکس)</span>
                </h3>

                {/* Upload Mode Selector */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setMediaUploadMode('file')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      mediaUploadMode === 'file'
                        ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>آپلود فایل از سیستم / گوشی</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaUploadMode('link')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      mediaUploadMode === 'link'
                        ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>لینک یا کد آپارات / یوتیوب / فایل</span>
                  </button>
                </div>
              </div>

              {/* Mode 1: File Dropzone */}
              {mediaUploadMode === 'file' && (
                <div className="space-y-3">
                  <input
                    ref={mediaFileInputRef}
                    type="file"
                    accept="video/*,image/*,.mp4,.webm,.mov,.mkv,.avi,.jpg,.jpeg,.png,.webp"
                    onChange={handleMediaFileChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => mediaFileInputRef.current?.click()}
                    className="border-2 border-dashed border-sky-300 dark:border-sky-800 hover:border-sky-500 dark:hover:border-sky-600 rounded-2xl p-6 text-center cursor-pointer transition bg-sky-50/40 dark:bg-sky-950/20 flex flex-col items-center justify-center space-y-2 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      برای انتخاب فایل ویدیویی یا تصویری کلیک کنید یا آن را اینجا بکشید
                    </p>
                    <p className="text-[11px] text-slate-400">
                      پشتیبانی از انواع فرمت‌های ویدیویی (MP4, WebM, MOV) و عکس (JPG, PNG) با استخراج خودکار فریم تامبنیل
                    </p>
                  </div>

                  {/* Upload Info */}
                  {uploadedFileInfo && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-emerald-900 dark:text-emerald-300">{uploadedFileInfo.name}</span>
                        <span className="text-slate-400">({uploadedFileInfo.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => mediaFileInputRef.current?.click()}
                        className="text-sky-600 font-bold hover:underline"
                      >
                        تغییر فایل
                      </button>
                    </div>
                  )}

                  {isUploadingMedia && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-500 font-bold">
                        <span>در حال بارگذاری و پردازش ویدیو...</span>
                        <span>{mediaUploadProgress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sky-600 transition-all duration-300"
                          style={{ width: `${mediaUploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mode 2: Link Input */}
              {mediaUploadMode === 'link' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    لینک فایل، لینک ویدیوی آپارات، یوتیوب یا کد Iframe *
                  </label>
                  <input
                    type="text"
                    required={mediaUploadMode === 'link'}
                    value={newMedia.url}
                    onChange={(e) => {
                      const val = e.target.value;
                      const parsed = parseVideoUrl(val);
                      setNewMedia({
                        ...newMedia,
                        url: val,
                        type: parsed.type === 'aparat' || parsed.type === 'youtube' || parsed.type === 'iframe' || parsed.type === 'direct' ? 'video' : newMedia.type
                      });
                    }}
                    placeholder="مثال: https://www.aparat.com/v/w950130 یا لینک فایل mp4 یا کد iframe"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                  />
                  {newMedia.url && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span className="font-bold text-sky-600">سرویس شناسایی‌شده:</span>
                      <span>{parseVideoUrl(newMedia.url).sourceLabel}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Common Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block font-bold mb-1">عنوان رسانه / ویدیو *</label>
                  <input
                    type="text"
                    required
                    value={newMedia.title}
                    onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                    placeholder="مثال: گزارش تصویری اختتامیه مسابقات رباتیک"
                    className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">نوع رسانه</label>
                  <select
                    value={newMedia.type}
                    onChange={(e) => setNewMedia({ ...newMedia, type: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="video">ویدیو / کلیپ تصویری</option>
                    <option value="image">عکس / تصویر</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">دسته‌بندی موضوعی</label>
                  <select
                    value={newMedia.category}
                    onChange={(e) => setNewMedia({ ...newMedia, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="علمی">علمی و رباتیک</option>
                    <option value="اردوها">اردوها و تفریحی</option>
                    <option value="سرود">سرود و آواها</option>
                    <option value="ورزشی">ورزشی و مسابقات</option>
                    <option value="مستند">مستند کانون</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-bold mb-1">توضیحات کوتاه (اختیاری)</label>
                  <input
                    type="text"
                    value={newMedia.description}
                    onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
                    placeholder="توضیح کوتاه درباره مکان، تاریخ و موضوع ویدیو یا تصویر..."
                    className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Live Preview Before Adding */}
              {newMedia.url && (
                <div className="p-4 rounded-2xl bg-slate-950 text-white space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-800 pb-2">
                    <span className="font-bold flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      پیش‌نمایش زنده قبل از انتشار:
                    </span>
                    <span className="text-[11px] text-slate-400">{parseVideoUrl(newMedia.url).sourceLabel}</span>
                  </div>
                  {newMedia.type === 'video' ? (
                    <div className="max-w-md mx-auto">
                      <SmartVideoPlayer url={newMedia.url} title={newMedia.title} thumbnail={newMedia.thumbnail} autoPlay={false} />
                    </div>
                  ) : newMedia.url && newMedia.url.trim() ? (
                    <div className="max-h-48 flex items-center justify-center overflow-hidden rounded-xl">
                      <ResolvedImage src={newMedia.url} alt="Preview" className="max-h-48 object-contain rounded-xl" />
                    </div>
                  ) : null}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewMedia({ title: '', type: 'video', url: '', thumbnail: '', category: 'علمی', description: '' });
                    setUploadedFileInfo(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200"
                >
                  انصراف و پاک‌سازی
                </button>
                <button
                  type="submit"
                  disabled={!newMedia.url || !newMedia.title}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-sky-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>انتشار و افزودن به رسانه‌خانه</span>
                </button>
              </div>
            </form>

            {/* Media Items List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mediaList.map((m) => {
                const isVid = m.type === 'video';
                const parsed = isVid ? parseVideoUrl(m.url) : null;
                const thumb = m.thumbnail || (parsed?.type === 'direct' ? '' : m.thumbnail) || m.url;

                return (
                  <div key={m.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between group">
                    <div className="h-32 bg-slate-950 relative flex items-center justify-center overflow-hidden">
                      {thumb && typeof thumb === 'string' && thumb.trim() ? (
                        <ResolvedImage
                          src={thumb}
                          alt={m.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                          fallback={<Film className="w-8 h-8 text-amber-400/70" />}
                        />
                      ) : (
                        <Film className="w-8 h-8 text-amber-400/70" />
                      )}
                      <span className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">
                        {m.category}
                      </span>
                      {isVid && (
                        <span className="absolute bottom-2 left-2 bg-amber-500 text-slate-950 text-[9px] px-1.5 py-0.5 rounded font-black flex items-center gap-1">
                          <Video className="w-2.5 h-2.5" />
                          <span>{parsed?.sourceLabel || 'ویدیو'}</span>
                        </span>
                      )}
                    </div>
                    <div className="p-3 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate flex-1" title={m.title}>
                        {m.title}
                      </span>
                      <button
                        onClick={() => deleteMedia(m.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition"
                        title="حذف رسانه"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 8: AUDIO & CHANTS ================= */}
        {activeTab === 'audio' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  مدیریت نواها، پادکست‌ها و سرودهای کانون
                </h2>
                <p className="text-xs text-slate-500">بارگذاری فایل صوتی MP3 یا درج لینک ترک برای پلیر سایت</p>
              </div>

              {/* Sample Preset Audio */}
              <button
                type="button"
                onClick={() => {
                  setNewAudio({
                    title: 'سرود آینده‌سازان انقلاب (تست صوتی)',
                    singer: 'گروه سرود نوجوانان منتظر',
                    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                    duration: '۰۳:۴۵'
                  });
                  setAudioUploadMode('link');
                  showToast('نمونه ترک صوتی در فرم قرار گرفت.', 'info');
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold flex items-center gap-1.5 hover:bg-purple-100 transition self-start sm:self-auto"
              >
                <Music className="w-3.5 h-3.5" />
                <span>تست ترک صوتی MP3</span>
              </button>
            </div>

            {/* Add Audio Form */}
            <form onSubmit={handleAddAudio} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-500" />
                  <span>افزودن ترک صوتی / سرود جدید</span>
                </h3>

                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAudioUploadMode('file')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      audioUploadMode === 'file'
                        ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>آپلود فایل صوتی</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAudioUploadMode('link')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      audioUploadMode === 'link'
                        ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>لینک مستقیم MP3</span>
                  </button>
                </div>
              </div>

              {audioUploadMode === 'file' ? (
                <div className="space-y-3">
                  <input
                    ref={audioFileInputRef}
                    type="file"
                    accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
                    onChange={handleAudioFileChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => audioFileInputRef.current?.click()}
                    className="border-2 border-dashed border-purple-300 dark:border-purple-800 hover:border-purple-500 dark:hover:border-purple-600 rounded-2xl p-6 text-center cursor-pointer transition bg-purple-50/40 dark:bg-purple-950/20 flex flex-col items-center justify-center space-y-2 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileAudio className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      برای انتخاب فایل صوتی (MP3, WAV, AAC) کلیک کنید
                    </p>
                  </div>

                  {uploadedAudioInfo && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-emerald-900 dark:text-emerald-300">{uploadedAudioInfo.name}</span>
                        <span className="text-slate-400">({uploadedAudioInfo.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => audioFileInputRef.current?.click()}
                        className="text-purple-600 font-bold hover:underline"
                      >
                        تغییر فایل
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold mb-1">لینک مستقیم فایل صوتی (MP3 URL) *</label>
                  <input
                    type="text"
                    required={audioUploadMode === 'link'}
                    value={newAudio.url}
                    onChange={(e) => setNewAudio({ ...newAudio, url: e.target.value })}
                    placeholder="https://.../song.mp3"
                    className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                <div>
                  <label className="block font-bold mb-1">عنوان سرود / نماهنگ *</label>
                  <input
                    type="text"
                    required
                    value={newAudio.title}
                    onChange={(e) => setNewAudio({ ...newAudio, title: e.target.value })}
                    placeholder="مثال: سرود منتظران خورشید"
                    className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">اجرا کننده / گروه</label>
                  <input
                    type="text"
                    value={newAudio.singer}
                    onChange={(e) => setNewAudio({ ...newAudio, singer: e.target.value })}
                    placeholder="گروه سرود کانون"
                    className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">مدت زمان تقریبی</label>
                  <input
                    type="text"
                    value={newAudio.duration}
                    onChange={(e) => setNewAudio({ ...newAudio, duration: e.target.value })}
                    placeholder="۰۳:۴۵"
                    className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!newAudio.url || !newAudio.title}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن به پلیر صوتی</span>
                </button>
              </div>
            </form>

            {/* Audio Tracks List */}
            <div className="space-y-2">
              {audioTracks.map((tr) => (
                <div
                  key={tr.id}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                      <Music className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{tr.title}</p>
                      <p className="text-[11px] text-slate-400">{tr.singer} • {tr.duration}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteAudioTrack(tr.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 9: MESSAGES INBOX ================= */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                پیام‌ها و نظرات کاربران
              </h2>
              <p className="text-xs text-slate-500">پیام‌های ارسال شده از طریق فرم ارتباط با ما</p>
            </div>

            <div className="space-y-3">
              {messages.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">هیچ پیامی دریافت نشده است.</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-5 rounded-2xl border transition space-y-2 ${
                      msg.isRead
                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        : 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{msg.name}</span>
                        <span className="text-slate-400 font-mono">({msg.phone})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">{msg.createdAt}</span>
                        {!msg.isRead && (
                          <button
                            onClick={() => markMessageRead(msg.id)}
                            className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-bold"
                          >
                            خوانده شد
                          </button>
                        )}
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      موضوع: {msg.subject}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-slate-800/40 p-3 rounded-xl">
                      {msg.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 10: SETTINGS ================= */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                تنظیمات کلی پایگاه کانون منتظر
              </h2>
              <p className="text-xs text-slate-500">تغییر عنوان، شعار، اطلاعات تماس و بیانیه‌ها</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold mb-1">نام رسمی کانون</label>
                  <input
                    type="text"
                    value={settingsForm.title}
                    onChange={(e) => setSettingsForm({ ...settingsForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">شعار محوری کانون</label>
                  <input
                    type="text"
                    value={settingsForm.motto}
                    onChange={(e) => setSettingsForm({ ...settingsForm, motto: e.target.value })}
                    className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1">متن معرفی و تاریخچه (درباره ما)</label>
                  <textarea
                    rows={3}
                    value={settingsForm.aboutText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
                    className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1">نشانی پستی مجتمع کانون</label>
                  <input
                    type="text"
                    value={settingsForm.contactAddress}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactAddress: e.target.value })}
                    className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">شماره تلفن ۱</label>
                  <input
                    type="text"
                    value={settingsForm.phone1}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone1: e.target.value })}
                    className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">شماره تلفن ۲</label>
                  <input
                    type="text"
                    value={settingsForm.phone2}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone2: e.target.value })}
                    className="w-full p-2.5 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>ذخیره کلیه تنظیمات</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

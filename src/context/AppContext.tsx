import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Article,
  Course,
  EventCamp,
  Member,
  MediaItem,
  ChantAudio,
  ContactMessage,
  SiteSettings,
  Registration,
  ViewType,
  ToastMessage,
  Comment
} from '../types';
import {
  initialSiteSettings,
  initialArticles,
  initialCourses,
  initialEvents,
  initialMembers,
  initialMedia,
  initialChants,
  initialMessages,
  initialRegistrations
} from '../data/initialData';
import { deleteMediaFromIndexedDB } from '../utils/indexedDBStorage';

interface AdminUser {
  name: string;
  username: string;
  role: string;
}

interface AppContextType {
  // Navigation & View
  currentView: ViewType;
  selectedId: string | null;
  navigateTo: (view: ViewType, id?: string | null) => void;

  // Dark Mode
  isDark: boolean;
  toggleDark: () => void;

  // Authentication - Admin
  isAdmin: boolean;
  adminUser: AdminUser | null;
  loginAdmin: (password: string, username?: string) => boolean;
  logoutAdmin: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  setShowAdminLogin: (open: boolean) => void;

  // Authentication - Member / Student
  loggedInMember: Member | null;
  loginMember: (identifier: string) => boolean;
  logoutMember: () => void;

  // Data Collections
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  articles: Article[];
  addArticle: (article: Omit<Article, 'id' | 'views' | 'likes' | 'comments'>) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  likeArticle: (id: string) => void;
  addComment: (articleId: string, authorName: string, text: string) => void;
  toggleCommentStatus: (articleId: string, commentId: string) => void;
  deleteComment: (articleId: string, commentId: string) => void;

  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'enrolledCount'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  events: EventCamp[];
  addEvent: (event: Omit<EventCamp, 'id' | 'registeredCount'>) => void;
  updateEvent: (id: string, event: Partial<EventCamp>) => void;
  deleteEvent: (id: string) => void;

  registrations: Registration[];
  addRegistration: (reg: Omit<Registration, 'id' | 'registeredAt' | 'status'>) => string;
  updateRegistrationStatus: (id: string, status: 'approved' | 'rejected' | 'pending') => void;
  deleteRegistration: (id: string) => void;

  members: Member[];
  addMember: (member: Omit<Member, 'id' | 'memberNumber' | 'joinedDate' | 'points' | 'status'>) => Member;
  updateMember: (id: string, member: Partial<Member>) => void;
  updateMemberPoints: (memberId: string, points: number) => void;
  deleteMember: (id: string) => void;
  findMemberByNumber: (num: string) => Member | undefined;

  mediaList: MediaItem[];
  addMedia: (media: Omit<MediaItem, 'id'>) => void;
  deleteMedia: (id: string) => void;

  chants: ChantAudio[];
  audioTracks: ChantAudio[];
  activeChant: ChantAudio | null;
  isPlayingAudio: boolean;
  playChant: (chant: ChantAudio) => void;
  toggleAudioPlay: () => void;
  stopAudio: () => void;
  addChant: (chant: Omit<ChantAudio, 'id' | 'plays'>) => void;
  addAudioTrack: (track: { title: string; singer?: string; url: string; duration?: string }) => void;
  deleteChant: (id: string) => void;
  deleteAudioTrack: (id: string) => void;

  messages: ContactMessage[];
  addMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>) => void;
  markMessageRead: (id: string) => void;
  replyMessage: (id: string, reply: string) => void;
  deleteMessage: (id: string) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, type?: 'success' | 'error' | 'info' | 'warning', message?: string) => void;
  removeToast: (id: string) => void;

  // System
  resetAllData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'kanoon_montazer_db_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Helper for safe storage reading
  const safeGetStorage = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return fallback;
      return JSON.parse(saved) as T;
    } catch (e) {
      console.warn(`Failed to parse storage item for key ${key}:`, e);
      return fallback;
    }
  };

  // Dark Mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('kanoon_theme');
      return saved ? saved === 'dark' : false;
    } catch {
      return false;
    }
  });

  // Admin Auth
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('kanoon_admin_session') === 'true';
    } catch {
      return false;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Member Auth
  const [loggedInMember, setLoggedInMember] = useState<Member | null>(() => {
    try {
      const saved = sessionStorage.getItem('kanoon_member_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const adminUser: AdminUser | null = isAdmin
    ? {
        name: 'مدیر کل کانون منتظر',
        username: 'admin',
        role: 'مدیر ارشد سامانه'
      }
    : null;

  // Core Data State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() =>
    safeGetStorage(`${LOCAL_STORAGE_KEY}_settings`, initialSiteSettings)
  );

  const [articles, setArticles] = useState<Article[]>(() =>
    safeGetStorage(`${LOCAL_STORAGE_KEY}_articles`, initialArticles)
  );

  const [courses, setCourses] = useState<Course[]>(() =>
    safeGetStorage(`${LOCAL_STORAGE_KEY}_courses`, initialCourses)
  );

  const [events, setEvents] = useState<EventCamp[]>(() =>
    safeGetStorage(`${LOCAL_STORAGE_KEY}_events`, initialEvents)
  );

  const [registrations, setRegistrations] = useState<Registration[]>(() =>
    safeGetStorage(`${LOCAL_STORAGE_KEY}_registrations`, initialRegistrations)
  );

  const [members, setMembers] = useState<Member[]>(() =>
    safeGetStorage(`${LOCAL_STORAGE_KEY}_members`, initialMembers)
  );

  const [mediaList, setMediaList] = useState<MediaItem[]>(() =>
    safeGetStorage(`${LOCAL_STORAGE_KEY}_media`, initialMedia)
  );

  const [chants, setChants] = useState<ChantAudio[]>(() =>
    safeGetStorage(`${LOCAL_STORAGE_KEY}_chants`, initialChants)
  );

  const [messages, setMessages] = useState<ContactMessage[]>(() =>
    safeGetStorage(`${LOCAL_STORAGE_KEY}_messages`, initialMessages)
  );

  // Audio Player State
  const [activeChant, setActiveChant] = useState<ChantAudio | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply dark mode class to html document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('kanoon_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('kanoon_theme', 'light');
    }
  }, [isDark]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_settings`, JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_articles`, JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_courses`, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_registrations`, JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_members`, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_media`, JSON.stringify(mediaList));
  }, [mediaList]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_chants`, JSON.stringify(chants));
  }, [chants]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_messages`, JSON.stringify(messages));
  }, [messages]);

  // Helper Toast
  const showToast = (title: string, type: 'success' | 'error' | 'info' | 'warning' = 'success', message?: string) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, title, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleDark = () => {
    setIsDark((prev) => !prev);
  };

  const navigateTo = (view: ViewType, id: string | null = null) => {
    setCurrentView(view);
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Persian/Arabic to English digit normalization helper
  const normalizeDigits = (str: string): string => {
    return str
      .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
      .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1584))
      .trim();
  };

  // Auth - Admin
  const loginAdmin = (password: string, username?: string): boolean => {
    const cleanPw = normalizeDigits(password).toLowerCase();
    const cleanUser = username ? normalizeDigits(username).toLowerCase() : '';

    // Standard accepted demo credentials
    const validPasswords = ['123456', 'admin123', 'admin', 'montazer', '1234', '12345', '1403'];

    if (validPasswords.includes(cleanPw) || (cleanUser === 'admin' && (validPasswords.includes(cleanPw) || cleanPw === ''))) {
      setIsAdmin(true);
      sessionStorage.setItem('kanoon_admin_session', 'true');
      showToast('ورود با موفقیت انجام شد', 'success', 'خوش آمدید، دسترسی به پنل مدیریت کانون فعال شد.');
      setIsLoginModalOpen(false);
      return true;
    }

    showToast('رمز عبور وارد شده صحیح نمی‌باشد', 'error', 'رمز پیش‌فرض مدیر: 123456 یا admin123 می‌باشد.');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('kanoon_admin_session');
    if (currentView === 'admin') {
      setCurrentView('home');
    }
    showToast('از حساب مدیریت خارج شدید', 'info');
  };

  // Auth - Member / Student
  const loginMember = (identifier: string): boolean => {
    const cleanId = normalizeDigits(identifier).toLowerCase();
    const member = members.find(
      (m) =>
        normalizeDigits(m.memberNumber).toLowerCase() === cleanId ||
        normalizeDigits(m.nationalId) === cleanId ||
        normalizeDigits(m.phone) === cleanId
    );

    if (member) {
      setLoggedInMember(member);
      sessionStorage.setItem('kanoon_member_session', JSON.stringify(member));
      showToast(`خوش آمدید، ${member.fullName}`, 'success', `امتیاز باشگاه: ${member.points} امتیاز`);
      setIsLoginModalOpen(false);
      navigateTo('membership');
      return true;
    }

    showToast('عضوی با این مشخصات یافت نشد', 'error', 'لطفاً کد ملی یا شماره همراه یا شماره عضویت را بررسی کنید.');
    return false;
  };

  const logoutMember = () => {
    setLoggedInMember(null);
    sessionStorage.removeItem('kanoon_member_session');
    showToast('از حساب کاربری خارج شدید', 'info');
  };

  // Site Settings
  const updateSiteSettings = (newSettings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('تنظیمات سایت با موفقیت ذخیره شد', 'success');
  };

  // Articles
  const addArticle = (artData: Omit<Article, 'id' | 'views' | 'likes' | 'comments'>) => {
    const newArt: Article = {
      ...artData,
      id: 'art-' + Date.now(),
      views: 1,
      likes: 0,
      comments: []
    };
    setArticles((prev) => [newArt, ...prev]);
    showToast('مطلب جدید با موفقیت منتشر شد', 'success');
  };

  const updateArticle = (id: string, artData: Partial<Article>) => {
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, ...artData } : a)));
    showToast('تغییرات مطلب ذخیره شد', 'success');
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    showToast('مطلب با موفقیت حذف شد', 'info');
  };

  const likeArticle = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, likes: a.likes + 1 } : a))
    );
    showToast('پسند شما ثبت شد!', 'success');
  };

  const addComment = (articleId: string, authorName: string, text: string) => {
    const newComment: Comment = {
      id: 'comm-' + Date.now(),
      authorName,
      text,
      createdAt: new Date().toLocaleDateString('fa-IR'),
      status: 'approved'
    };
    setArticles((prev) =>
      prev.map((a) =>
        a.id === articleId ? { ...a, comments: [newComment, ...a.comments] } : a
      )
    );
    showToast('نظر شما با موفقیت ثبت و منتشر شد', 'success');
  };

  const toggleCommentStatus = (articleId: string, commentId: string) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id !== articleId) return a;
        return {
          ...a,
          comments: a.comments.map((c) =>
            c.id === commentId
              ? { ...c, status: c.status === 'approved' ? 'pending' : 'approved' }
              : c
          )
        };
      })
    );
    showToast('وضعیت انتشار دیدگاه تغییر یافت', 'info');
  };

  const deleteComment = (articleId: string, commentId: string) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === articleId
          ? { ...a, comments: a.comments.filter((c) => c.id !== commentId) }
          : a
      )
    );
    showToast('دیدگاه با موفقیت حذف شد', 'info');
  };

  // Courses
  const addCourse = (courseData: Omit<Course, 'id' | 'enrolledCount'>) => {
    const newCourse: Course = {
      ...courseData,
      id: 'course-' + Date.now(),
      enrolledCount: 0
    };
    setCourses((prev) => [newCourse, ...prev]);
    showToast('دوره آموزشی جدید افزوده شد', 'success');
  };

  const updateCourse = (id: string, courseData: Partial<Course>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...courseData } : c)));
    showToast('اطلاعات دوره بروزرسانی شد', 'success');
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    showToast('دوره آموزشی حذف شد', 'info');
  };

  // Events
  const addEvent = (eventData: Omit<EventCamp, 'id' | 'registeredCount'>) => {
    const newEvent: EventCamp = {
      ...eventData,
      id: 'event-' + Date.now(),
      registeredCount: 0
    };
    setEvents((prev) => [newEvent, ...prev]);
    showToast('اردو/رویداد جدید با موفقیت ثبت شد', 'success');
  };

  const updateEvent = (id: string, eventData: Partial<EventCamp>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...eventData } : e)));
    showToast('اطلاعات رویداد بروز شد', 'success');
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showToast('رویداد حذف شد', 'info');
  };

  // Registrations
  const addRegistration = (regData: Omit<Registration, 'id' | 'registeredAt' | 'status'>): string => {
    const trackingId = 'REG-' + Math.floor(100000 + Math.random() * 900000);
    const newReg: Registration = {
      ...regData,
      id: trackingId,
      status: 'pending',
      registeredAt: new Date().toLocaleDateString('fa-IR')
    };
    setRegistrations((prev) => [newReg, ...prev]);

    // Update count in course or event
    if (regData.type === 'course') {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === regData.targetId ? { ...c, enrolledCount: c.enrolledCount + 1 } : c
        )
      );
    } else {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === regData.targetId ? { ...e, registeredCount: e.registeredCount + 1 } : e
        )
      );
    }

    showToast(
      'ثبت‌نام با موفقیت انجام شد',
      'success',
      `کد پیگیری شما: ${trackingId} - کارشناسان کانون به زودی تماس خواهند گرفت.`
    );
    return trackingId;
  };

  const updateRegistrationStatus = (id: string, status: 'approved' | 'rejected' | 'pending') => {
    setRegistrations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    showToast('وضعیت ثبت‌نام تغییر یافت', 'info');
  };

  const deleteRegistration = (id: string) => {
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
    showToast('درخواست ثبت‌نام حذف شد', 'info');
  };

  // Members
  const addMember = (memberData: Omit<Member, 'id' | 'memberNumber' | 'joinedDate' | 'points' | 'status'>): Member => {
    const count = members.length + 101;
    const memberNumber = `MN-1403-${count}`;
    const newMember: Member = {
      ...memberData,
      id: 'mem-' + Date.now(),
      memberNumber,
      joinedDate: new Date().toLocaleDateString('fa-IR'),
      points: 100,
      status: 'active'
    };
    setMembers((prev) => [newMember, ...prev]);
    showToast('عضویت جدید در کانون صادر شد!', 'success', `شماره عضویت: ${memberNumber}`);
    return newMember;
  };

  const updateMember = (id: string, memberData: Partial<Member>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...memberData } : m)));
    showToast('مشخصات عضو کانون ویرایش شد', 'success');
  };

  const updateMemberPoints = (memberId: string, points: number) => {
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, points } : m)));
    showToast('امتیاز عضو کانون بروزرسانی شد', 'success');
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    showToast('پرونده عضو با موفقیت حذف گردید', 'info');
  };

  const findMemberByNumber = (num: string): Member | undefined => {
    const clean = normalizeDigits(num).toLowerCase();
    return members.find(
      (m) =>
        normalizeDigits(m.memberNumber).toLowerCase() === clean ||
        normalizeDigits(m.nationalId) === clean ||
        normalizeDigits(m.phone) === clean
    );
  };

  // Media
  const addMedia = (mediaData: Omit<MediaItem, 'id'>) => {
    const newMedia: MediaItem = {
      ...mediaData,
      id: 'med-' + Date.now()
    };
    setMediaList((prev) => [newMedia, ...prev]);
    showToast('فایل رسانه‌ای جدید بارگذاری شد', 'success');
  };

  const deleteMedia = (id: string) => {
    const item = mediaList.find((m) => m.id === id);
    if (item && item.url && item.url.startsWith('idb://')) {
      deleteMediaFromIndexedDB(item.url);
    }
    setMediaList((prev) => prev.filter((m) => m.id !== id));
    showToast('فایل از رسانه‌خانه حذف شد', 'info');
  };

  // Audio Chants
  const playChant = (chant: ChantAudio) => {
    setActiveChant(chant);
    setIsPlayingAudio(true);
    setChants((prev) =>
      prev.map((c) => (c.id === chant.id ? { ...c, plays: c.plays + 1 } : c))
    );
  };

  const toggleAudioPlay = () => {
    setIsPlayingAudio((prev) => !prev);
  };

  const stopAudio = () => {
    setIsPlayingAudio(false);
    setActiveChant(null);
  };

  const addChant = (chantData: Omit<ChantAudio, 'id' | 'plays'>) => {
    const newChant: ChantAudio = {
      ...chantData,
      id: 'chant-' + Date.now(),
      plays: 0
    };
    setChants((prev) => [newChant, ...prev]);
    showToast('قطعه صوتی/سرود جدید اضافه شد', 'success');
  };

  const addAudioTrack = (track: { title: string; singer?: string; url: string; duration?: string }) => {
    addChant({
      title: track.title,
      singerGroup: track.singer || 'گروه سرود کانون منتظر',
      audioUrl: track.url,
      duration: track.duration || '۰۳:۴۵',
      coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop'
    });
  };

  const deleteChant = (id: string) => {
    const chant = chants.find((c) => c.id === id);
    if (chant && chant.audioUrl && chant.audioUrl.startsWith('idb://')) {
      deleteMediaFromIndexedDB(chant.audioUrl);
    }
    setChants((prev) => prev.filter((c) => c.id !== id));
    if (activeChant?.id === id) {
      stopAudio();
    }
    showToast('سرود با موفقیت حذف گردید', 'info');
  };

  const deleteAudioTrack = (id: string) => {
    deleteChant(id);
  };

  // Messages
  const addMessage = (msgData: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>) => {
    const newMsg: ContactMessage = {
      ...msgData,
      id: 'msg-' + Date.now(),
      createdAt: new Date().toLocaleDateString('fa-IR'),
      isRead: false
    };
    setMessages((prev) => [newMsg, ...prev]);
    showToast('پیام شما با موفقیت ارسال شد', 'success', 'پاسخ به زودی برای شما ارسال خواهد شد.');
  };

  const markMessageRead = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
  };

  const replyMessage = (id: string, reply: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, reply, isRead: true } : m))
    );
    showToast('پاسخ پیام با موفقیت ذخیره گردید', 'success');
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    showToast('پیام حذف شد', 'info');
  };

  // Reset & Backup
  const resetAllData = () => {
    setSiteSettings(initialSiteSettings);
    setArticles(initialArticles);
    setCourses(initialCourses);
    setEvents(initialEvents);
    setRegistrations(initialRegistrations);
    setMembers(initialMembers);
    setMediaList(initialMedia);
    setChants(initialChants);
    setMessages(initialMessages);
    showToast('اطلاعات به مقادیر اولیه بازنشانی شد', 'info');
  };

  const exportDataJSON = (): string => {
    const data = {
      siteSettings,
      articles,
      courses,
      events,
      registrations,
      members,
      mediaList,
      chants,
      messages,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.siteSettings) setSiteSettings(parsed.siteSettings);
      if (parsed.articles) setArticles(parsed.articles);
      if (parsed.courses) setCourses(parsed.courses);
      if (parsed.events) setEvents(parsed.events);
      if (parsed.registrations) setRegistrations(parsed.registrations);
      if (parsed.members) setMembers(parsed.members);
      if (parsed.mediaList) setMediaList(parsed.mediaList);
      if (parsed.chants) setChants(parsed.chants);
      if (parsed.messages) setMessages(parsed.messages);
      showToast('اطلاعات با موفقیت بازیابی شد', 'success');
      return true;
    } catch {
      showToast('فرمت فایل نامعتبر است', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        selectedId,
        navigateTo,
        isDark,
        toggleDark,
        isAdmin,
        adminUser,
        loginAdmin,
        logoutAdmin,
        isLoginModalOpen,
        setIsLoginModalOpen,
        setShowAdminLogin: setIsLoginModalOpen,
        loggedInMember,
        loginMember,
        logoutMember,
        siteSettings,
        updateSiteSettings,
        articles,
        addArticle,
        updateArticle,
        deleteArticle,
        likeArticle,
        addComment,
        toggleCommentStatus,
        deleteComment,
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        registrations,
        addRegistration,
        updateRegistrationStatus,
        deleteRegistration,
        members,
        addMember,
        updateMember,
        updateMemberPoints,
        deleteMember,
        findMemberByNumber,
        mediaList,
        addMedia,
        deleteMedia,
        chants,
        audioTracks: chants,
        activeChant,
        isPlayingAudio,
        playChant,
        toggleAudioPlay,
        stopAudio,
        addChant,
        addAudioTrack,
        deleteChant,
        deleteAudioTrack,
        messages,
        addMessage,
        markMessageRead,
        replyMessage,
        deleteMessage,
        toasts,
        showToast,
        removeToast,
        resetAllData,
        exportDataJSON,
        importDataJSON
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

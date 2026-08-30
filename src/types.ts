export type CategoryType = 
  | 'فرهنگی'
  | 'مذهبی'
  | 'علمی_رباتیک'
  | 'اردویی_ورزشی'
  | 'سرود_هنر'
  | 'اطلاعیه'
  | 'همه';

export interface Comment {
  id: string;
  authorName: string;
  text: string;
  createdAt: string;
  status: 'approved' | 'pending';
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: 'فرهنگی' | 'مذهبی' | 'علمی_رباتیک' | 'اردویی_ورزشی' | 'سرود_هنر' | 'اطلاعیه';
  author: string;
  publishedAt: string;
  views: number;
  likes: number;
  tags: string[];
  comments: Comment[];
  isFeatured?: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: 'علمی_مهندسی' | 'قرآنی_معارفی' | 'هنر_رسانه' | 'ورزشی_مهارتی';
  description: string;
  instructor: string;
  instructorAvatar?: string;
  duration: string;
  schedule: string;
  ageGroup: string;
  capacity: number;
  enrolledCount: number;
  fee: string; // e.g. "رایگان" or "۲۵۰,۰۰۰ تومان"
  image: string;
  syllabus: string[];
  status: 'active' | 'upcoming' | 'completed';
  requirements: string;
}

export interface EventCamp {
  id: string;
  title: string;
  type: 'camp' | 'ceremony' | 'competition' | 'workshop';
  destination: string;
  startDate: string;
  endDate: string;
  fee: string;
  capacity: number;
  registeredCount: number;
  image: string;
  gallery: string[];
  description: string;
  requiredItems: string[];
  rules: string;
  isRegistrationOpen: boolean;
}

export interface Registration {
  id: string;
  type: 'course' | 'event';
  targetId: string;
  targetTitle: string;
  fullName: string;
  nationalId: string;
  phone: string;
  fatherPhone: string;
  birthDate: string;
  schoolGrade: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
  notes?: string;
}

export interface Member {
  id: string;
  memberNumber: string; // e.g. "MN-1403-105"
  fullName: string;
  fatherName: string;
  nationalId: string;
  birthDate: string;
  phone: string;
  parentPhone: string;
  schoolGrade: string;
  interests: string[];
  skills: string[];
  photoUrl: string;
  joinedDate: string;
  status: 'active' | 'inactive';
  points: number;
  groupUnit: string; // e.g. "واحد شهید آوینی"
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  category: string;
  date: string;
  description?: string;
  fileSize?: string;
}

export interface ChantAudio {
  id: string;
  title: string;
  singerGroup: string;
  duration: string;
  audioUrl: string;
  coverImage: string;
  lyrics?: string;
  plays: number;
}

export type EventItem = EventCamp;
export type AudioTrack = ChantAudio;

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  reply?: string;
}

export interface HeaderBanner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  linkTab: string;
  buttonText: string;
}

export interface MentorLeader {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  specialty: string;
}

export interface SiteSettings {
  name: string;
  motto: string;
  aboutText: string;
  visionText: string;
  contactAddress: string;
  phone1: string;
  phone2: string;
  email: string;
  socialLinks: {
    eitaa: string;
    bale: string;
    rubika: string;
    telegram: string;
    instagram: string;
  };
  stats: {
    activeMembers: number;
    heldCourses: number;
    heldCamps: number;
    honorCount: number;
  };
  banners: HeaderBanner[];
  leaders: MentorLeader[];
}

export type ViewType = 
  | 'home'
  | 'news'
  | 'article-detail'
  | 'courses'
  | 'course-detail'
  | 'events'
  | 'event-detail'
  | 'gallery'
  | 'membership'
  | 'about'
  | 'contact'
  | 'admin';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

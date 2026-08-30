import { Article, Course, EventCamp, Member, MediaItem, ChantAudio, ContactMessage, SiteSettings, Registration } from '../types';

export const initialSiteSettings: SiteSettings = {
  name: 'کانون فرهنگی تربیتی نوجوانان منتظر',
  motto: 'تربیت نسل جوان، با ایمان، پویا و پیشرو در مسیر تمدن اسلامی',
  aboutText: 'کانون فرهنگی تربیتی نوجوانان منتظر از سال ۱۳۹۲ با هدف شناسایی، رشد و هدایت استعدادهای علمی، فرهنگی، قرآنی، هنری و ورزشی نوجوانان آغاز به کار نمود. این مجموعه محیطی صمیمی، پرنشاط و بالنده را برای رشد همه‌جانبه فرزندان این مرز و بوم فراهم آورده است.',
  visionText: 'تربیت نوجوانانی مؤمن، خلاق، مسئولیت‌پذیر، صاحب مهارت و پیشرو در عرصه‌های علمی، اجتماعی و فرهنگی با تکیه بر الگوی ناب اسلامی ایرانی.',
  contactAddress: 'تهران، خیابان انقلاب، میدان شهدا، خیابان مجاهدین اسلام، مجتمع فرهنگی تربیتی منتظر',
  phone1: '۰۲۱-۷۷۸۸۹۹۰۰',
  phone2: '۰۹۱۲۳۴۵۶۷۸۹',
  email: 'info@montazer-youth.ir',
  socialLinks: {
    eitaa: 'https://eitaa.com/montazer_youth',
    bale: 'https://ble.ir/montazer_youth',
    rubika: 'https://rubika.ir/montazer_youth',
    telegram: 'https://t.me/montazer_youth',
    instagram: 'https://instagram.com/montazer_youth'
  },
  stats: {
    activeMembers: 385,
    heldCourses: 48,
    heldCamps: 26,
    honorCount: 19
  },
  banners: [
    {
      id: 'banner-1',
      title: 'ثبت‌نام ترم جدید دوره‌های مهارتی و علمی کانون آغاز شد',
      subtitle: 'کلاس‌های تخصصی رباتیک، تدوین و رسانه، صوت و لحن قرآن و لیگ فوتسال نوجوانان',
      badge: 'ثبت‌نام ترم پاییز و زمستان',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
      linkTab: 'courses',
      buttonText: 'مشاهده دوره‌ها و ثبت‌نام'
    },
    {
      id: 'banner-2',
      title: 'اردوی بزرگ زیارتی فرهنگی مشهد مقدس (همسفر تا خورشید)',
      subtitle: 'ویژه اعضای فعال کانون به همراه برنامه‌های جذاب رصدی، مسابقات کویر و زیارت بارگاه امام رضا (ع)',
      badge: 'اردوی ویژه پاییز',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
      linkTab: 'events',
      buttonText: 'جزییات اردو و پیش‌ثبت‌نام'
    },
    {
      id: 'banner-3',
      title: 'کارت عضویت دیجیتال و اختصاصی کانون نوجوانان منتظر',
      subtitle: 'ثبت‌نام کنید، کد اختصاصی و کیوآرکد دریافت کنید و از امکانات ویژه و تخفیف اردوها بهره‌مند شوید',
      badge: 'عضویت رایگان',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
      linkTab: 'membership',
      buttonText: 'دریافت کارت عضویت'
    }
  ],
  leaders: [
    {
      id: 'lead-1',
      name: 'استاد علیرضا حسینی',
      role: 'مدیر کانون و مشاور تربیتی',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      bio: 'کارشناس ارشد روانشناسی تربیتی با ۱۰ سال سابقه هدایت کانون‌های نوجوانان',
      specialty: 'مشاوره تحصیلی و هدایت گروهی'
    },
    {
      id: 'lead-2',
      name: 'مهندس محمدمهدی رضایی',
      role: 'مسئول واحد علمی و فناوری',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
      bio: 'فارغ‌التحصیل دانشگاه صنعتی شریف و مربی تیم‌های رباتیک خوارزمی',
      specialty: 'رباتیک، هوش مصنوعی و کدنویسی'
    },
    {
      id: 'lead-3',
      name: 'حجت‌الاسلام صادقی',
      role: 'معاونت فرهنگی و مربی قرآن',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
      bio: 'قاری ممتاز و کارشناس معارف اسلامی با سابقه مدیریت اردوهای جهادی',
      specialty: 'تجوید، ترتیل و مباحث انگیزشی'
    },
    {
      id: 'lead-4',
      name: 'محمدجواد کاظمی',
      role: 'سرپرست گروه سرود و رسانه',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
      bio: 'آهنگساز و مستندساز با رتبه‌های استانی در جشنواره‌های سرود دانش‌آموزی',
      specialty: 'تدوین، عکاسی و همخوانی'
    }
  ]
};

export const initialArticles: Article[] = [
  {
    id: 'art-1',
    title: 'افتخارآفرینی تیم رباتیک کانون منتظر در مسابقات استانی نوجوانان',
    slug: 'robotics-team-provincial-championship',
    excerpt: 'تیم رباتیک کانون نوجوانان منتظر موفق به کسب مقام اول در بخش طراحی کاوشگر نجات و سازه‌های خلاق شد.',
    content: `
      <p>در رقابت‌های پرشور مسابقات رباتیک نوجوانان استان تهران که با حضور بیش از ۳۵ تیم از سراسر استان برگزار گردید، تیم پژوهشگران نوجوان کانون منتظر با ارائه طرح نوآورانه «ربات امدادگر هوشمند» موفق شد رتبه اول این دوره از رقابت‌ها را به خود اختصاص دهد.</p>
      
      <h3>تلاش‌های ماه‌های اخیر به ثمر نشست</h3>
      <p>این موفقیت حاصل ۵ ماه تلاش مستمر و شرکت در کارگاه‌های هفتگی کانون و پشتیبانی مربیان محترم واحد علمی می‌باشد. اعضای تیم متشکل از ۵ نفر از نوجوانان پایه هشتم و نهم بودند که با برنامه‌نویسی میکروکنترلرها و ساخت بدنه سه بعدی، تحسین داوران را برانگیختند.</p>
      
      <blockquote>«یکی از اهداف اصلی کانون، تلفیق ایمان و روحیه جهادی با تخصص روز علمی و فناوری است.» — مهندس رضایی، سرپرست واحد علمی</blockquote>
      
      <p>در پایان مراسم با اهدای لوح زرین و جوایز نقدی از اعضای تیم تجلیل به عمل آمد و این عزیزان مجوز حضور در رقابت‌های کشوری را کسب نمودند.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop',
    category: 'علمی_رباتیک',
    author: 'واحد رسانه و روابط عمومی',
    publishedAt: '۱۴۰۳/۰۸/۱۵',
    views: 420,
    likes: 68,
    tags: ['رباتیک', 'مسابقات', 'هوش مصنوعی', 'افتخارات'],
    isFeatured: true,
    comments: [
      {
        id: 'c-1',
        authorName: 'علی پورمحمدی (عضو کانون)',
        text: 'تبریک فراوان به بچه‌های تیم رباتیک، واقعا عالی کار کردید!',
        createdAt: '۱۴۰۳/۰۸/۱۶',
        status: 'approved'
      },
      {
        id: 'c-2',
        authorName: 'محمدرضا کاظمی',
        text: 'ان‌شاءالله در مسابقات کشوری هم پرچم کانون رو بالا ببرید.',
        createdAt: '۱۴۰۳/۰۸/۱۷',
        status: 'approved'
      }
    ]
  },
  {
    id: 'art-2',
    title: 'گزارش تصویری: اردوی جهادی و رصد نجومی در کویر مرنجاب',
    slug: 'astronomy-and-cultural-desert-camp-report',
    excerpt: 'حضور ۴۰ نفر از نوجوانان کانون در اردوی دو روزه کویر شامل کلاس رصد آسمان شب، مسابقات شن‌پیمایی و فعالیت‌های خیرخواهانه.',
    content: `
      <p>اردوی دو روزه تفریحی تربیتی کویر مرنجاب با حضور پرشور اعضای فعال کانون با موفقیت برگزار شد. در این برنامه، نوجوانان علاوه بر آشنایی با شگفتی‌های خلقت در رصد آسمان شب با تلسکوپ‌های پیشرفته، در مسابقات ورزشی و مهیج نیز شرکت کردند.</p>
      
      <h3>برنامه‌های اجرا شده در اردو:</h3>
      <ul>
        <li>کارگاه عملی ستاره‌شناسی و رصد سیارات با تلسکوپ ۱۰ اینچی دابسونی</li>
        <li>مسابقات طناب‌کشی، فوتبال ساحلی روی رمل‌های شنی و والیبال</li>
        <li>برگزاری محفل صمیمی قرائت قرآن و دعای کمیل زیر آسمان پر ستاره</li>
        <li>کمک به بازسازی و رنگ‌آمیزی مدرسه روستای محروم مجاور</li>
      </ul>
      
      <p>این اردو با هدف ارتقای روحیه کار تیمی، تقویت نشاط روحی و پرورش مسئولیت‌پذیری اجتماعی برگزار گردید.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    category: 'اردویی_ورزشی',
    author: 'واحد اردوها و تربیت‌بدنی',
    publishedAt: '۱۴۰۳/۰۸/۱۰',
    views: 612,
    likes: 95,
    tags: ['اردو', 'کویر', 'نجوم', 'جهادی'],
    isFeatured: true,
    comments: [
      {
        id: 'c-3',
        authorName: 'سید حسین حسینی',
        text: 'یکی از بهترین اردوهای عمرم بود. رصد مشتری و زحل فوق‌العاده بود!',
        createdAt: '۱۴۰۳/۰۸/۱۱',
        status: 'approved'
      }
    ]
  },
  {
    id: 'art-3',
    title: 'رونمایی از سرود جدید «آینده‌سازان ظهور» توسط گروه سرود منتظر',
    slug: 'new-chant-launch-ayandehsazan',
    excerpt: 'جدیدترین اثر صوتی گروه سرود کانون همزمان با میلاد امام عصر (عج) در صداوسیما و فضای مجازی منتشر شد.',
    content: `
      <p>اثر جدید گروه سرود و همخوانی کانون نوجوانان منتظر با نام «آینده‌سازان ظهور» با همراهی گروه نوازندگی و ترانه‌سرایی اختصاصی منتشر شد و مورد استقبال پرشور خانواده‌ها و مربیان تربیتی قرار گرفت.</p>
      <p>علاقه‌مندان می‌توانند این اثر زیبا را از بخش پلیر صوتی وب‌سایت کانون به‌صورت آنلاین بشنوند یا با کیفیت بالا دریافت نمایند.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    category: 'سرود_هنر',
    author: 'واحد سرود و آواهای انقلابی',
    publishedAt: '۱۴۰۳/۰۸/۰۲',
    views: 380,
    likes: 54,
    tags: ['سرود', 'موسیقی', 'مهدویت', 'هنر'],
    comments: []
  },
  {
    id: 'art-4',
    title: 'چگونه نوجوانان می‌توانند زمان خود را برای مطالعه و ورزش مدیریت کنند؟',
    slug: 'time-management-tips-for-teens',
    excerpt: 'راهکارهای عملی و اثبات‌شده از زبان مشاور کانون برای تعادل بین تکالیف درسی، فعالیت‌های مهارتی و ورزش.',
    content: `
      <p>یکی از بزرگ‌ترین دغدغه‌های نوجوانان امروز، احساس کمبود وقت در مواجهه با انبوه تکالیف مدرسه، امتحانات و علایق فردی است. در این مقاله به ۵ گام اساسی برای برنامه‌ریزی روزانه پرداخته‌ایم.</p>
      <h3>۱. تکنیک مسدودسازی زمانی (Time Blocking)</h3>
      <p>به جای داشتن لیست کارهای بی‌پایان، برای هر بخش از روز یک بلوک زمانی مشخص تعیین کنید.</p>
      <h3>۲. خواب کافی و استراحت فعال</h3>
      <p>مغز نوجوان برای تثبیت یادگیری حداقل به ۸ ساعت خواب باکیفیت شبانه نیاز دارد.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    category: 'فرهنگی',
    author: 'استاد علیرضا حسینی',
    publishedAt: '۱۴۰۳/۰۷/۲۴',
    views: 290,
    likes: 41,
    tags: ['مشاوره', 'برنامه‌ریزی', 'تربیت', 'درس'],
    comments: []
  }
];

export const initialCourses: Course[] = [
  {
    id: 'course-1',
    title: 'دوره جامع ساخت ربات جنگجو و فوتبالیست',
    category: 'علمی_مهندسی',
    description: 'آموزش عملی مکانیک ربات، بردهای الکترونیکی، لحیم‌کاری اصولی و برنامه‌نویسی کنترلر به همراه مسابقات پایان دوره.',
    instructor: 'مهندس محمدمهدی رضایی',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    duration: '۱۲ جلسه (۲۴ ساعت)',
    schedule: 'پنج‌شنبه‌ها ساعت ۹ الی ۱۱',
    ageGroup: '۱۲ الی ۱۶ سال',
    capacity: 20,
    enrolledCount: 16,
    fee: '۳۵۰,۰۰۰ تومان',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop',
    syllabus: [
      'مقدمه‌ای بر الکترونیک و قطعات پایه (موتورها، درایورها، باتری‌ها)',
      'طراحی مکانیک و شاسی فلزی و اکریلیک',
      'اصول لحیم‌کاری ایمن و ساخت برد مدار چاپی',
      'برنامه‌نویسی آردوینو و راه‌اندازی سنسورها',
      'راه‌اندازی ریموت کنترل و آماده‌سازی برای مسابقه نهایی'
    ],
    status: 'active',
    requirements: 'علاقه به کارهای فنی و کنجکاوی علمی (بسته قطعات در کانون تحویل داده می‌شود)'
  },
  {
    id: 'course-2',
    title: 'کارگاه تولید محتوا، فیلم‌برداری و تدوین با موبایل',
    category: 'هنر_رسانه',
    description: 'آموزش نورپردازی خلاقانه، صدابرداری، کار با نرم‌افزارهای CapCut و Premiere، ساخت پادکست و ولاگ‌های اثرگذار.',
    instructor: 'محمدجواد کاظمی',
    instructorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
    duration: '۱۰ جلسه (۲۰ ساعت)',
    schedule: 'سه‌شنبه‌ها ساعت ۱۶ الی ۱۸',
    ageGroup: '۱۳ الی ۱۸ سال',
    capacity: 18,
    enrolledCount: 14,
    fee: '۲۸۰,۰۰۰ تومان',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop',
    syllabus: [
      'اصول کادربندی و زاویه دوربین در روایت تصویری',
      'تکنیک‌های تدوین سریع و موشن‌گرافی با موبایل',
      'اصلاح رنگ، افکت‌های صوتی و انتخاب موسیقی متناسب',
      'تولید تیزر و مستند کوتاه فرهنگی به صورت گروهی'
    ],
    status: 'active',
    requirements: 'داشتن یک گوشی هوشمند اندروید یا iOS'
  },
  {
    id: 'course-3',
    title: 'کلاس تخصصی صوت، لحن و تجوید قرآن کریم',
    category: 'قرآنی_معارفی',
    description: 'آموزش مقامات موسیقی تلاوت (بیات، صبا، رست، حجاز، سه‌گاه)، ترتیل‌خوانی نوین و حفظ موضوعی آیات کاربردی زندگی.',
    instructor: 'حجت‌الاسلام صادقی',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    duration: '۱۶ جلسه (۳۲ ساعت)',
    schedule: 'دوشنبه‌ها و چهارشنبه‌ها ساعت ۱۷ الی ۱۸:۳۰',
    ageGroup: '۱۰ الی ۱۷ سال',
    capacity: 25,
    enrolledCount: 22,
    fee: 'رایگان (وقف فرهنگی)',
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=600&auto=format&fit=crop',
    syllabus: [
      'اصول خروج مخارج حروف و صفات تفخیم و ترقیق',
      'شناخت مقامات قرآنی بر پایه سبک استاد عبدالباسط و منشاوی',
      'فن بیان، تنظیم نفس و کنترل تنفس در تلاوت',
      'حفظ مفاهیم و پیام‌های سبک زندگی قرآنی'
    ],
    status: 'active',
    requirements: 'تسلط مقدماتی به روان‌خوانی قرآن کریم'
  },
  {
    id: 'course-4',
    title: 'باشگاه فوتسال و آمادگی جسمانی نوجوانان منتظر',
    category: 'ورزشی_مهارتی',
    description: 'تمرینات تاکتیکی سالنی، افزایش چابکی، تکنیک‌های فردی و حضور در لیگ دوره‌ای کانون‌های نوجوانان.',
    instructor: 'کاپیتان مرتضی نجفی',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    duration: '۱۵ جلسه (۳۰ ساعت)',
    schedule: 'شنبه‌ها و دوشنبه‌ها ساعت ۱۸:۳۰ الی ۲۰',
    ageGroup: '۱۱ الی ۱۶ سال',
    capacity: 24,
    enrolledCount: 20,
    fee: '۲۲۰,۰۰۰ تومان',
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=600&auto=format&fit=crop',
    syllabus: [
      'گرم کردن حرفه‌ای و تست‌های چابکی و هوازی',
      'پاس، کنترل توپ، دریبلینگ و ضربه دقیق به چارچوب',
      'سیستم‌های دفاعی و ضدحمله تیمی در فوتسال',
      'اخلاق ورزشی و مدیریت استرس در مسابقات'
    ],
    status: 'active',
    requirements: 'لباس ورزشی و کفش سالنی مناسب'
  }
];

export const initialEvents: EventCamp[] = [
  {
    id: 'event-1',
    title: 'اردوی زیارتی، فرهنگی و تفریحی مشهد مقدس (همسفر با خورشید)',
    type: 'camp',
    destination: 'مشهد مقدس - بارگاه منور امام رضا (ع) و پارک آبی موج‌های خروشان',
    startDate: '۱۴۰۳/۰۹/۱۴',
    endDate: '۱۴۰۳/۰۹/۱۸',
    fee: '۱,۴۵۰,۰۰۰ تومان (همراه با تخفیف ۵۰٪ کانون)',
    capacity: 45,
    registeredCount: 38,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'سفر چهار روزه با قطار چهارتخته اختصاصی، اسکان در هتل آپارتمان مجهز نزدیک حرم، برنامه‌های حرم‌شناسی، مسابقات ورزشی، تفریح در پارک آبی و حلقه‌های صمیمی شبانه.',
    requiredItems: [
      'رضایت‌نامه کتبی والدین',
      'کارت ملی و شناسنامه',
      'دفترچه بیمه خدمات درمانی',
      'لوازم شخصی، لباس گرم و کفش مناسب پیاده‌روی'
    ],
    rules: 'رعایت شئونات اسلامی، حضور سر وقت در تمامی گردهمایی‌ها و پایبندی به سرگروه محترم الزامی است.',
    isRegistrationOpen: true
  },
  {
    id: 'event-2',
    title: 'مسابقه بزرگ دست‌سازه‌های خلاق و نجات تخم‌مرغ',
    type: 'competition',
    destination: 'حیاط مرکزی و سالن همایش‌های کانون منتظر',
    startDate: '۱۴۰۳/۰۸/۲۸',
    endDate: '۱۴۰۳/۰۸/۲۸',
    fee: 'رایگان',
    capacity: 60,
    registeredCount: 42,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'مسابقه‌ای شاد، علمی و پرچالش که در آن گروه‌های دو نفره سازه‌هایی سبک با استفاده از نی، چسب و بادکنک می‌سازند تا تخم‌مرغ را از ارتفاع ۱۰ متری بدون شکستن نجات دهند!',
    requiredItems: ['قیچی، خط‌کش و مداد (سایر وسایل در محل اهدا می‌شود)'],
    rules: 'تیم‌ها باید قبل از پرتاب سازه، وزن‌کشی سازه خود را به تایید هیئت داوران برسانند.',
    isRegistrationOpen: true
  }
];

export const initialMembers: Member[] = [
  {
    id: 'mem-1',
    memberNumber: 'MN-1403-101',
    fullName: 'امیرعلی صادقیان',
    fatherName: 'حسین',
    nationalId: '0023456781',
    birthDate: '۱۳۸۸/۰۴/۱۵',
    phone: '۰۹۱۲۱۱۱۱۱۱۱',
    parentPhone: '۰۹۱۲۲۲۲۲۲۲۲',
    schoolGrade: 'پایه نهم',
    interests: ['رباتیک', 'عکاسی', 'فوتسال'],
    skills: ['برنامه‌نویسی مقدماتی پایتون', 'طراحی پوستر با فتوشاپ'],
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop',
    joinedDate: '۱۴۰۲/۰۷/۱۰',
    status: 'active',
    points: 480,
    groupUnit: 'واحد شهید مهدی باکری'
  },
  {
    id: 'mem-2',
    memberNumber: 'MN-1403-102',
    fullName: 'محمدحسین مرادی',
    fatherName: 'محمدرضا',
    nationalId: '0028765432',
    birthDate: '۱۳۸۹/۰۲/۲۰',
    phone: '۰۹۱۲۳۳۳۳۳۳۳',
    parentPhone: '۰۹۱۲۴۴۴۴۴۴۴',
    schoolGrade: 'پایه هشتم',
    interests: ['قرائت قرآن', 'سرود', 'شعر'],
    skills: ['تلاوت ترتیل و صوت', 'همخوانی کرال'],
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    joinedDate: '۱۴۰۲/۰۹/۰۱',
    status: 'active',
    points: 520,
    groupUnit: 'واحد شهید مصطفی احمدی‌روشن'
  },
  {
    id: 'mem-3',
    memberNumber: 'MN-1403-103',
    fullName: 'پارسا رضایی‌فر',
    fatherName: 'احمد',
    nationalId: '0019988776',
    birthDate: '۱۳۸۷/۱۱/۰۵',
    phone: '۰۹۱۹۵۵۵۵۵۵۵',
    parentPhone: '۰۹۱۹۶۶۶۶۶۶۶',
    schoolGrade: 'پایه دهم',
    interests: ['تدوین ویدیو', 'پادکست', 'کوهنوردی'],
    skills: ['تدوین با Premiere Pro', 'صدابرداری استودیویی'],
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    joinedDate: '۱۴۰۱/۰۴/۱۵',
    status: 'active',
    points: 640,
    groupUnit: 'واحد شهید مرتضی آوینی'
  }
];

export const initialMedia: MediaItem[] = [
  {
    id: 'med-1',
    title: 'افتتاحیه کارگاه رباتیک پاییزه',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop',
    category: 'علمی',
    date: '۱۴۰۳/۰۸/۱۰',
    description: 'حضور اعضای دوره رباتیک در آزمایشگاه فنی کانون'
  },
  {
    id: 'med-2',
    title: 'لحظات ماندگار اردوی کویر مرنجاب',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop',
    category: 'اردوها',
    date: '۱۴۰۳/۰۸/۰۵',
    description: 'رصد ستارگان در آسمان پاک کویر'
  },
  {
    id: 'med-3',
    title: 'اجرای زنده گروه سرود در سالن اجلاس',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop',
    category: 'سرود',
    date: '۱۴۰۳/۰۷/۲۸',
    description: 'اجرای اثر آینده‌سازان با حضور میهمانان برجسته'
  },
  {
    id: 'med-4',
    title: 'فینال مسابقات فوتسال جام شهدای نوجوان',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1000&auto=format&fit=crop',
    category: 'ورزشی',
    date: '۱۴۰۳/۰۷/۱۵',
    description: 'هیجان بازی پایانی و اهدای کاپ قهرمانی به تیم شهید باکری'
  },
  {
    id: 'med-5',
    title: 'تیزر مستند فعالیت‌های کانون نوجوانان منتظر',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
    category: 'مستند',
    date: '۱۴۰۳/۰۶/۲۰',
    description: 'خلاصه ویدئویی از دوره‌ها، اردوها و فعالیت‌های نوجوانان کانون'
  },
  {
    id: 'med-6',
    title: 'کلیپ اجرای زنده همخوانی سرود آینده‌سازان (آپارات)',
    type: 'video',
    url: 'https://www.aparat.com/v/w950130',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    category: 'سرود',
    date: '۱۴۰۳/۰۷/۰۱',
    description: 'پخش اختصاصی کلیپ سرود کانون از طریق بستر آپارات'
  },
  {
    id: 'med-7',
    title: 'مسابقه هیجان‌انگیز ربات‌های جنگجو',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop',
    category: 'علمی',
    date: '۱۴۰۳/۰۸/۱۵',
    description: 'رقابت نفس‌گیر ربات‌های ساخته شده توسط دانش‌آموزان کارگاه رباتیک کانون'
  }
];

export const initialChants: ChantAudio[] = [
  {
    id: 'chant-1',
    title: 'سرود آینده‌سازان ظهور',
    singerGroup: 'گروه سرود نوجوانان منتظر',
    duration: '۰۳:۴۵',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop',
    lyrics: 'ما نوجوانان غیور این دیاریم / در سینه شور و عهد و پیمانی داریم...',
    plays: 1420
  },
  {
    id: 'chant-2',
    title: 'نغمه امید و پرواز',
    singerGroup: 'گروه همخوانی عمار',
    duration: '۰۴:۱۲',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop',
    lyrics: 'بال پرواز گشودیم به افلاک بلند / نام ایران به بلندای جهان باد بلند...',
    plays: 980
  },
  {
    id: 'chant-3',
    title: 'پادکست صوتی: ایستگاه نوجوان (قسمت اول)',
    singerGroup: 'واحد رسانه و رادیو کانون',
    duration: '۰۸:۳۰',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=400&auto=format&fit=crop',
    lyrics: 'گفت‌وگوی صمیمی با نفرات اول مسابقات علمی و خاطرات شنیدنی از اردوهای هیجان‌انگیز.',
    plays: 650
  }
];

export const initialMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'سید علی موسوی',
    phone: '۰۹۱۲۹۹۹۸۸۷۷',
    email: 'mousavi@gmail.com',
    subject: 'پرسش درباره ثبت‌نام دوره دوم رباتیک',
    message: 'سلام وقت بخیر، پسرم پایه هفتم هست، آیا پیش‌نیازی برای شرکت در کلاس رباتیک نیاز داره یا از صفر آموزش داده میشه؟',
    createdAt: '۱۴۰۳/۰۸/۱۶',
    isRead: false
  },
  {
    id: 'msg-2',
    name: 'خانم رضایی (ولی دانش‌آموز)',
    phone: '۰۹۱۹۴۴۴۱۱۲۲',
    subject: 'تشکر بابت اردوی کویر',
    message: 'با سلام و تشکر از زحمات کادر محترم کانون منتظر، اردوی کویر برای پسرم بسیار آموزنده و نشاط‌آور بود. خدا قوت.',
    createdAt: '۱۴۰۳/۰۸/۱۲',
    isRead: true,
    reply: 'سلام و احترام، خوشحالیم که برنامه مورد رضایت شما و فرزند گرامیتان واقع شده است.'
  }
];

export const initialRegistrations: Registration[] = [
  {
    id: 'reg-1',
    type: 'course',
    targetId: 'course-1',
    targetTitle: 'دوره جامع ساخت ربات جنگجو و فوتبالیست',
    fullName: 'امیرحسین ابراهیمی',
    nationalId: '0034567890',
    phone: '۰۹۱۲۰۰۰۱۱۱۱',
    fatherPhone: '۰۹۱۲۰۰۰۲۲۲۲',
    birthDate: '۱۳۸۹/۰۵/۱۱',
    schoolGrade: 'پایه هشتم',
    status: 'approved',
    registeredAt: '۱۴۰۳/۰۸/۱۴'
  },
  {
    id: 'reg-2',
    type: 'event',
    targetId: 'event-1',
    targetTitle: 'اردوی زیارتی، فرهنگی و تفریحی مشهد مقدس',
    fullName: 'طاها کریمی',
    nationalId: '0021122334',
    phone: '۰۹۳۵۴۴۴۳۳۲۲',
    fatherPhone: '۰۹۳۵۴۴۴۳۳۱۱',
    birthDate: '۱۳۸۸/۰۳/۲۲',
    schoolGrade: 'پایه نهم',
    status: 'pending',
    registeredAt: '۱۴۰3/۰۸/۱۵'
  }
];

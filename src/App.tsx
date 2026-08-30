import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { QuickSearchModal } from './components/QuickSearchModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';

// Views
import { HomeView } from './views/HomeView';
import { NewsView } from './views/NewsView';
import { ArticleDetailView } from './views/ArticleDetailView';
import { CoursesView } from './views/CoursesView';
import { CourseDetailView } from './views/CourseDetailView';
import { EventsView } from './views/EventsView';
import { EventDetailView } from './views/EventDetailView';
import { GalleryView } from './views/GalleryView';
import { MembershipView } from './views/MembershipView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { AdminDashboard } from './views/AdminDashboard';
import { ShieldAlert, LogIn } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentView, adminUser, setShowAdminLogin } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'news':
        return <NewsView />;
      case 'article-detail':
        return <ArticleDetailView />;
      case 'courses':
        return <CoursesView />;
      case 'course-detail':
        return <CourseDetailView />;
      case 'events':
        return <EventsView />;
      case 'event-detail':
        return <EventDetailView />;
      case 'gallery':
        return <GalleryView />;
      case 'membership':
        return <MembershipView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'admin':
        if (!adminUser) {
          return (
            <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 mx-auto flex items-center justify-center">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">ورود به پنل مدیریت کانون</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                این بخش مختص مسئولین و مربیان کانون می‌باشد. لطفاً جهت دسترسی وارد شوید.
              </p>
              <button
                onClick={() => setShowAdminLogin(true)}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>ورود به حساب مدیریت</span>
              </button>
            </div>
          );
        }
        return <AdminDashboard />;
      default:
        return <HomeView />;
    }
  };

  const isAdminView = currentView === 'admin' && !!adminUser;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Toast Notification System */}
      <ToastContainer />

      {/* Global Modals */}
      <AdminLoginModal />
      <QuickSearchModal />

      {/* Conditional Header: Show on public views */}
      {!isAdminView && <Header />}

      {/* Main Content Area */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Conditional Footer: Show on public views */}
      {!isAdminView && <Footer />}

      {/* Audio Player for Chants: Always available on public views */}
      {!isAdminView && <AudioPlayerBar />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

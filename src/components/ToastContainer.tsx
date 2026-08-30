import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-5 left-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = CheckCircle2;
          let colorStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/90 dark:text-emerald-100 dark:border-emerald-700';
          let iconColor = 'text-emerald-600 dark:text-emerald-400';

          if (toast.type === 'error') {
            Icon = AlertCircle;
            colorStyle = 'border-rose-500 bg-rose-50 text-rose-950 dark:bg-rose-950/90 dark:text-rose-100 dark:border-rose-700';
            iconColor = 'text-rose-600 dark:text-rose-400';
          } else if (toast.type === 'info') {
            Icon = Info;
            colorStyle = 'border-sky-500 bg-sky-50 text-sky-950 dark:bg-sky-950/90 dark:text-sky-100 dark:border-sky-700';
            iconColor = 'text-sky-600 dark:text-sky-400';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            colorStyle = 'border-amber-500 bg-amber-50 text-amber-950 dark:bg-amber-950/90 dark:text-amber-100 dark:border-amber-700';
            iconColor = 'text-amber-600 dark:text-amber-400';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md ${colorStyle}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 text-sm">
                <p className="font-bold">{toast.title}</p>
                {toast.message && (
                  <p className="mt-1 text-xs opacity-90 leading-relaxed">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors opacity-70 hover:opacity-100"
                aria-label="بستن"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

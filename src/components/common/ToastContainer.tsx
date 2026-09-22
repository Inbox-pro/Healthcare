import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const bgColors = {
          success: 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100',
          error: 'bg-rose-50 dark:bg-rose-950/90 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100',
          warning: 'bg-amber-50 dark:bg-amber-950/90 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100',
          info: 'bg-sky-50 dark:bg-sky-950/90 border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-100',
        };

        const Icon = {
          success: CheckCircle2,
          error: AlertCircle,
          warning: AlertTriangle,
          info: Info,
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-lg backdrop-blur-xs transition-all duration-200 animate-in slide-in-from-bottom-3 ${bgColors[toast.type]}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-90" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">{toast.title}</p>
              {toast.message && (
                <p className="text-xs mt-0.5 opacity-80 leading-normal">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

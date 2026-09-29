import React from 'react';
import { useToastStore } from '../../shared/hooks/useToast';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toasts, removeToast } = useToastStore();

  return (
    <>
      {children}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto px-4 py-2.5 rounded-2xl text-sm font-medium shadow-xl backdrop-blur-md flex items-center justify-between transition-all transform animate-fadeIn ${
              toast.type === 'success'
                ? 'bg-emerald-600/90 text-white'
                : toast.type === 'error'
                ? 'bg-rose-600/90 text-white'
                : 'bg-slate-900/90 text-white'
            }`}
          >
            <span>{toast.message}</span>
            <span className="material-symbols-outlined text-sm ml-2 opacity-70">close</span>
          </div>
        ))}
      </div>
    </>
  );
};

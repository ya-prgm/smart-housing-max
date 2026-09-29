import React from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  return (
    <div
      className={`px-4 py-3 rounded-2xl text-sm font-medium shadow-lg backdrop-blur-md flex items-center justify-between ${
        type === 'success'
          ? 'bg-emerald-600 text-white'
          : type === 'error'
          ? 'bg-rose-600 text-white'
          : 'bg-slate-900 text-white'
      }`}
    >
      <span>{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} className="ml-3 text-white/70 hover:text-white">
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      )}
    </div>
  );
};

import React from 'react';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Ошибка загрузки',
  message = 'Не удалось загрузить данные с сервера. Попробуйте снова.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center my-6">
      <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-4 border border-rose-100">
        <span className="material-symbols-outlined text-[32px]">error</span>
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-4">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition active:scale-95 cursor-pointer shadow-sm"
        >
          Повторить
        </button>
      )}
    </div>
  );
};

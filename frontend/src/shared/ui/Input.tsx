import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-slate-700">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[18px] pointer-events-none">
              {icon}
            </span>
          )}
          <input
            id={id}
            ref={ref}
            className={`w-full h-11 rounded-xl bg-slate-50 border border-slate-200 px-3.5 text-sm text-slate-800 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 ${
              icon ? 'pl-10' : ''
            } ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

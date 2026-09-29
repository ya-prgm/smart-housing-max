import React from 'react';

interface SettingsRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onClick?: () => void;
  destructive?: boolean;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  title,
  subtitle,
  rightElement,
  onClick,
  destructive = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 flex items-center justify-between transition-colors ${
        onClick ? 'cursor-pointer active:bg-slate-50' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            destructive
              ? 'bg-rose-50 text-rose-600'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <div className="flex flex-col">
          <span
            className={`text-[14px] font-semibold ${
              destructive ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {title}
          </span>
          {subtitle && (
            <span className="text-[12px] text-slate-400 mt-0.5">{subtitle}</span>
          )}
        </div>
      </div>

      <div>
        {rightElement ? (
          rightElement
        ) : onClick ? (
          <span className="material-symbols-outlined text-[20px] text-slate-400">
            chevron_right
          </span>
        ) : null}
      </div>
    </div>
  );
};

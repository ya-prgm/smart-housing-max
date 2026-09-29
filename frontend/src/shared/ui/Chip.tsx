import React from 'react';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: string;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onClick,
  icon,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 cursor-pointer whitespace-nowrap ${
        selected
          ? 'bg-slate-900 text-white shadow-sm'
          : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
      } ${className}`}
    >
      {icon && <span className="material-symbols-outlined text-[16px]">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

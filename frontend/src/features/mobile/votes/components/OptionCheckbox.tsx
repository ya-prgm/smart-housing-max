import React from 'react';

interface OptionCheckboxProps {
  id: string | number;
  label: string;
  subtext?: string | null;
  isSelected: boolean;
  onToggle: (id: string | number) => void;
}

export const OptionCheckbox: React.FC<OptionCheckboxProps> = ({
  id,
  label,
  subtext,
  isSelected,
  onToggle,
}) => {
  return (
    <div
      onClick={() => onToggle(id)}
      className={`rounded-xl p-3.5 transition-all duration-200 flex items-start gap-3 cursor-pointer select-none border active:scale-[0.99] ${
        isSelected
          ? 'bg-[#ecf4ff] border-primary shadow-xs'
          : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
      }`}
    >
      <div
        className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
          isSelected
            ? 'bg-primary text-white shadow-xs'
            : 'bg-slate-100 border border-slate-300/70 text-transparent'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[18px] font-bold transition-opacity ${
            isSelected ? 'opacity-100' : 'opacity-0'
          }`}
        >
          check
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[14px] sm:text-[15px] font-semibold text-slate-900 leading-snug block">
          {label}
        </span>
        {subtext && (
          <p className="text-[12px] sm:text-[13px] text-slate-500 mt-0.5 leading-relaxed">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};

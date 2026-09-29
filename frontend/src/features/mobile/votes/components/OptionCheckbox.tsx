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
      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
        isSelected
          ? 'bg-sky-50/70 border-primary shadow-xs'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      <div
        className={`w-5 h-5 rounded-lg border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${
          isSelected
            ? 'bg-primary border-primary text-white'
            : 'border-slate-300 bg-white'
        }`}
      >
        {isSelected && (
          <span className="material-symbols-outlined text-[16px] leading-none">
            check
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <span
          className={`text-[14px] leading-tight font-medium ${
            isSelected ? 'text-slate-900 font-semibold' : 'text-slate-700'
          }`}
        >
          {label}
        </span>
        {subtext && (
          <span className="text-[12px] text-slate-500 mt-0.5 leading-snug">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};

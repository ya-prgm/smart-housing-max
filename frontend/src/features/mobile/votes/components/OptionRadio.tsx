import React from 'react';

interface OptionRadioProps {
  id: string | number;
  label: string;
  subtext?: string | null;
  isSelected: boolean;
  onSelect: (id: string | number) => void;
}

export const OptionRadio: React.FC<OptionRadioProps> = ({
  id,
  label,
  subtext,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
        isSelected
          ? 'bg-sky-50/70 border-primary shadow-xs'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${
          isSelected ? 'border-primary' : 'border-slate-300'
        }`}
      >
        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
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

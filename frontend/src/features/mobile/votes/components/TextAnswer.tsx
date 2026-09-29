import React from 'react';

interface TextAnswerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export const TextAnswer: React.FC<TextAnswerProps> = ({
  value,
  onChange,
  placeholder = 'Введите ваш ответ или предложение...',
  maxLength = 500,
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        rows={4}
        placeholder={placeholder}
        className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none shadow-xs"
      />
      <div className="flex justify-end text-[11px] text-slate-400">
        <span>
          {value.length} / {maxLength}
        </span>
      </div>
    </div>
  );
};

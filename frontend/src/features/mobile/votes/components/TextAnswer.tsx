import React from 'react';

interface TextAnswerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

const SUGGESTIONS = [
  'Открытие по звонку с мобильного',
  'Пропуск для курьеров и такси',
  'Беспрепятственный проезд скорой',
];

export const TextAnswer: React.FC<TextAnswerProps> = ({
  value,
  onChange,
  placeholder = 'Напишите ваши предложения или замечания...',
  maxLength = 500,
}) => {
  const handleAddSuggestion = (text: string) => {
    let next = value.trim();
    if (next.length > 0 && !next.endsWith('.') && !next.endsWith(',')) {
      next += ', ';
    } else if (next.length > 0) {
      next += ' ';
    }
    const candidate = next + text;
    if (candidate.length <= maxLength) {
      onChange(candidate);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative bg-[#ecf4ff] rounded-2xl p-3.5 border border-slate-200/80 focus-within:bg-white focus-within:border-primary focus-within:shadow-sm transition-all duration-200">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          rows={5}
          placeholder={placeholder}
          className="w-full bg-transparent resize-none outline-none text-[14px] sm:text-[15px] text-slate-900 placeholder:text-slate-400 leading-relaxed"
        />
        <div className="flex justify-between items-center pt-2 mt-1 border-t border-slate-200/40">
          <span className="text-[11px] text-slate-400 font-medium">
            Не более {maxLength} символов
          </span>
          <span className="text-[11px] text-slate-500 font-semibold tracking-tight">
            {value.length} / {maxLength} символов
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] text-slate-400 font-medium mr-1">Быстрые варианты:</span>
        {SUGGESTIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handleAddSuggestion(item)}
            className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-[11px] font-medium hover:border-primary hover:text-primary active:scale-95 transition-all cursor-pointer"
          >
            + {item}
          </button>
        ))}
      </div>
    </div>
  );
};

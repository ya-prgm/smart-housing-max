import React, { useState } from 'react';
import { TopicItem } from '../api';

interface ClassifierInputProps {
  value: string;
  selectedCode?: string;
  onSelect: (topic: { code: string; title: string }) => void;
  topics?: TopicItem[];
}

const DEFAULT_TOPICS = [
  { code: '2.16', title: 'Прорыв трубы / стояка отопления или ГВС' },
  { code: '1.04', title: 'Неисправность пассажирского лифта' },
  { code: '3.02', title: 'Некачественная уборка подъезда и лестничных клеток' },
  { code: '4.01', title: 'Отсутствие освещения на придомовой территории' },
  { code: '5.10', title: 'Неисправность домофонной связи' },
  { code: '6.03', title: 'Переполнение мусорных контейнеров' },
];

export const ClassifierInput: React.FC<ClassifierInputProps> = ({
  value,
  onSelect,
  topics = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const list = topics.length > 0
    ? topics.map((t) => ({ code: t.code, title: t.title }))
    : DEFAULT_TOPICS;

  const filtered = list.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.code.includes(search)
  );

  return (
    <div className="flex flex-col gap-1.5 relative">
      <label className="text-[13px] font-bold text-slate-800">
        Классификатор проблемы ЖКХ
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[48px] p-3 rounded-xl border border-slate-200 bg-white text-left flex items-center justify-between shadow-xs hover:border-slate-300 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2 truncate">
          <span className="material-symbols-outlined text-primary text-[20px] shrink-0">
            category
          </span>
          <span className="text-[13px] font-medium text-slate-900 truncate">
            {value || 'Выберите категорию проблемы'}
          </span>
        </div>
        <span className="material-symbols-outlined text-slate-400 text-[20px] shrink-0">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 flex flex-col gap-2 max-h-64 overflow-hidden">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по классификатору..."
              className="w-full h-9 pl-8 pr-3 text-[12px] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div className="overflow-y-auto max-h-48 flex flex-col divide-y divide-slate-100">
            {filtered.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  onSelect(item);
                  setIsOpen(false);
                }}
                className="p-2.5 text-left hover:bg-sky-50 rounded-lg transition-colors flex items-start gap-2 cursor-pointer"
              >
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono font-semibold shrink-0">
                  {item.code}
                </span>
                <span className="text-[13px] text-slate-800 leading-snug">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

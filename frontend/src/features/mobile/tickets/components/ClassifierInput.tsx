import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ticketsApi, TopicItem } from '../api';
import { useHaptic } from '../../../../shared/hooks/useHaptic';

interface ClassifierInputProps {
  value: string;
  selectedCode?: string;
  selectedSection?: string;
  onSelect: (topic: TopicItem) => void;
  onClear?: () => void;
}

export const ClassifierInput: React.FC<ClassifierInputProps> = ({
  value,
  selectedCode,
  selectedSection,
  onSelect,
  onClear,
}) => {
  const { impact } = useHaptic();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: topics = [], isLoading } = useQuery({
    queryKey: ['topics', debouncedSearch],
    queryFn: () => ticketsApi.getTopics(debouncedSearch.trim() || undefined),
    staleTime: 60000,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (topic: TopicItem) => {
    impact('light');
    onSelect(topic);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    impact('light');
    if (onClear) onClear();
    setSearchTerm('');
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-2 relative w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-[11px] flex items-center justify-center font-bold">
            1
          </span>
          <label className="text-[15px] text-on-surface font-semibold" htmlFor="classifier-input">
            Тема обращения по классификатору
          </label>
        </div>
      </div>

      <div className="relative bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all p-2.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-outline text-[20px]">search</span>
          <input
            id="classifier-input"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Введите код или проблему (например: 2.16 или труба)..."
            className="w-full bg-transparent text-[14px] text-on-surface outline-none placeholder:text-outline font-medium"
          />
          {(searchTerm || selectedCode) && (
            <button
              type="button"
              onClick={handleClear}
              className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-on-surface cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          )}
        </div>

        {selectedCode && value && (
          <div className="mt-2.5 pt-2.5 border-t border-surface-variant/60 flex items-center justify-between bg-primary-fixed/30 rounded-xl px-3 py-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-1.5 py-0.5 rounded-md bg-primary text-on-primary text-[11px] font-bold shrink-0 font-mono">
                {selectedCode}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] text-on-surface font-semibold truncate leading-tight">
                  {value}
                </p>
                {selectedSection && (
                  <p className="text-[11px] text-on-surface-variant truncate mt-0.5 leading-tight">
                    {selectedSection}
                  </p>
                )}
              </div>
            </div>
            <span className="material-symbols-outlined text-primary text-[18px] shrink-0 ml-1">
              check_circle
            </span>
          </div>
        )}

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-2xl z-50 p-2 flex flex-col gap-1 max-h-72 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-outline flex items-center justify-between">
              <span>
                {debouncedSearch ? `Результаты поиска (${topics.length})` : 'Категории из классификатора'}
              </span>
              {isLoading && (
                <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            <div className="overflow-y-auto max-h-60 flex flex-col divide-y divide-surface-variant/40">
              {isLoading && topics.length === 0 ? (
                <div className="py-6 text-center text-xs text-outline">
                  Поиск по классификатору...
                </div>
              ) : topics.length > 0 ? (
                topics.map((t) => (
                  <button
                    key={t.code}
                    type="button"
                    onClick={() => handleSelect(t)}
                    className={`p-2.5 text-left rounded-xl transition-all flex items-start gap-2.5 cursor-pointer ${
                      selectedCode === t.code
                        ? 'bg-primary-fixed/40'
                        : 'hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="px-1.5 py-0.5 rounded-md bg-surface-container text-on-surface text-[11px] font-mono font-bold shrink-0 mt-0.5">
                      {t.code}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-semibold text-on-surface leading-snug">
                        {t.title}
                      </span>
                      {t.section_title && (
                        <span className="text-[11px] text-on-surface-variant leading-tight mt-0.5">
                          {t.section_title}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-6 text-center">
                  <span className="material-symbols-outlined text-outline text-[28px] mb-1">
                    search_off
                  </span>
                  <p className="text-xs text-on-surface-variant font-medium">Ничего не найдено в классификаторе</p>
                  <p className="text-[11px] text-outline mt-0.5">Попробуйте ввести другие ключевые слова</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

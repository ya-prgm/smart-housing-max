import React from 'react';

export type FilterValue = 'all' | 'my' | 'active' | 'in_progress' | 'completed';

export interface TicketFiltersProps {
  currentFilter: FilterValue;
  onFilterChange: (val: FilterValue) => void;
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({ currentFilter, onFilterChange }) => {
  const filters: Array<{ id: FilterValue; label: string }> = [
    { id: 'all', label: 'Все' },
    { id: 'my', label: 'Мои' },
    { id: 'active', label: 'Новые' },
    { id: 'in_progress', label: 'В работе' },
    { id: 'completed', label: 'Выполнены' },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
      {filters.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => onFilterChange(f.id)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition active:scale-95 cursor-pointer ${
            currentFilter === f.id
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

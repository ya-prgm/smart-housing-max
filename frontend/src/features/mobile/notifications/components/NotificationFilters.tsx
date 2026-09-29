import React from 'react';
import { NotificationCategory } from '../../../../shared/types/notification';

interface NotificationFiltersProps {
  selectedCategory: NotificationCategory;
  onSelectCategory: (category: NotificationCategory) => void;
  unreadCount?: number;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  unreadCount = 0,
}) => {
  const filters: { id: NotificationCategory; label: string }[] = [
    { id: 'all', label: `Все${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
    { id: 'uk', label: 'УК' },
    { id: 'chairperson', label: 'Совет МКД' },
    { id: 'system', label: 'Система' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
      {filters.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => onSelectCategory(f.id)}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all active:scale-95 cursor-pointer ${
            selectedCategory === f.id
              ? 'bg-primary text-white font-semibold shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:text-slate-900'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

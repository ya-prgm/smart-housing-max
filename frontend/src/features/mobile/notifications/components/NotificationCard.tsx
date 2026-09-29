import React from 'react';
import { NotificationResponse } from '../../../../shared/types/notification';

interface NotificationCardProps {
  notification: NotificationResponse;
  onClick?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onClick,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'uk':
        return 'corporate_fare';
      case 'chairperson':
        return 'shield_person';
      case 'ticket':
        return 'assignment';
      case 'system':
      default:
        return 'notifications';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'uk':
        return 'bg-blue-50 text-blue-600';
      case 'chairperson':
        return 'bg-amber-50 text-amber-600';
      case 'ticket':
        return 'bg-emerald-50 text-emerald-600';
      case 'system':
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <article
      onClick={onClick}
      className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex gap-3 relative ${
        !notification.is_read
          ? 'bg-sky-50/40 border-primary/20 shadow-xs'
          : 'bg-white border-slate-100 hover:border-slate-200'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getCategoryColor(
          notification.category
        )}`}
      >
        <span className="material-symbols-outlined text-[20px]">
          {getCategoryIcon(notification.category)}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[12px] font-bold text-slate-800 truncate">
              {notification.author_name}
            </span>
            {notification.author_badge && (
              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-medium shrink-0">
                {notification.author_badge}
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 shrink-0">
            {notification.time_formatted || 'Недавно'}
          </span>
        </div>

        <h3 className="text-[14px] font-semibold text-slate-900 leading-snug mb-1">
          {notification.title}
        </h3>
        <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-3">
          {notification.text}
        </p>
      </div>

      {!notification.is_read && (
        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary" />
      )}
    </article>
  );
};

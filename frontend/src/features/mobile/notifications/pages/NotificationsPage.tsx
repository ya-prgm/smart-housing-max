import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useHaptic } from '../../../../shared/hooks/useHaptic';
import { NotificationCategory } from '../../../../shared/types/notification';
import { notificationsApi } from '../api';
import { NotificationCard } from '../components/NotificationCard';
import { NotificationFilters } from '../components/NotificationFilters';
import { Skeleton } from '../../../../shared/ui/Skeleton';
import { EmptyState } from '../../../../shared/ui/EmptyState';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { impact, notification } = useHaptic();

  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('all');

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getNotifications(),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAllRead = () => {
    impact('medium');
    notification('success');
    markAllReadMutation.mutate();
  };

  const filteredNotifications = notifications.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const newItems = filteredNotifications.filter((n) => !n.is_read);
  const earlierItems = filteredNotifications.filter((n) => n.is_read);

  return (
    <div className="bg-[#f7f9ff] text-slate-900 min-h-screen flex flex-col relative select-none pb-20">
      <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 pt-safe">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Назад"
              onClick={() => navigate(-1)}
              className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight">
              Уведомления
            </h1>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-[13px] font-semibold text-primary hover:text-primary/80 active:scale-95 transition-all cursor-pointer"
            >
              Прочитать все
            </button>
          )}
        </div>
      </header>

      <div className="px-4 pt-3">
        <NotificationFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          unreadCount={unreadCount}
        />
      </div>

      <main className="px-4 pt-3 flex flex-col gap-4 max-w-[430px] mx-auto w-full">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <EmptyState
            title="Нет уведомлений"
            description="У вас пока нет непрочитанных или сохраненных сообщений"
            icon="notifications"
          />
        ) : (
          <>
            {newItems.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <span className="text-[12px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  Новые ({newItems.length})
                </span>
                {newItems.map((item) => (
                  <NotificationCard
                    key={item.id}
                    notification={item}
                    onClick={() => {
                      if (item.action_url) {
                        navigate(item.action_url);
                      }
                    }}
                  />
                ))}
              </div>
            )}

            {earlierItems.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <span className="text-[12px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  Ранее
                </span>
                {earlierItems.map((item) => (
                  <NotificationCard
                    key={item.id}
                    notification={item}
                    onClick={() => {
                      if (item.action_url) {
                        navigate(item.action_url);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
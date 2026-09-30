import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '../../features/mobile/notifications/api';

export const useUnreadNotifications = () => {
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getNotifications(),
    staleTime: 30000,
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return {
    unreadCount,
    hasUnread: unreadCount > 0,
  };
};

import { apiClient } from '../../../shared/api/client';
import { NotificationResponse } from '../../../shared/types/notification';

export const notificationsApi = {
  getNotifications: async (): Promise<NotificationResponse[]> => {
    const { data } = await apiClient.get<NotificationResponse[]>('/notifications');
    return data;
  },

  markAllRead: async (): Promise<{ status: string; message: string }> => {
    const { data } = await apiClient.post<{ status: string; message: string }>(
      '/notifications/mark-all-read'
    );
    return data;
  },
};

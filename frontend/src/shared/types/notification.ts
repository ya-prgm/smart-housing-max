export type NotificationCategory = 'all' | 'system' | 'chairperson' | 'uk' | 'ticket';

export interface NotificationResponse {
  id: number;
  category: string;
  author_name: string;
  author_badge?: string | null;
  title: string;
  text: string;
  is_read: boolean;
  action_url?: string | null;
  created_at: string;
  time_formatted?: string | null;
}

export interface NotificationItem {
  id: string | number;
  category: string;
  authorName: string;
  authorBadge?: string;
  time: string;
  title: string;
  text: string;
  isUnread: boolean;
  icon?: string;
  avatarText?: string;
  actionUrl?: string | null;
}
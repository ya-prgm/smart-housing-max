export type NotificationCategory = 'all' | 'system' | 'chairperson' | 'uk';

export interface NotificationItem {
  id: string;
  category: 'system' | 'chairperson' | 'uk';
  authorName: string;
  authorBadge?: string;
  time: string;
  title: string;
  text: string;
  isUnread: boolean;
  icon?: string;
  avatarText?: string;
}
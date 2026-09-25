export interface Attachment {
  type: 'image' | 'file' | 'camera';
  name?: string;
  size?: string;
  url?: string;
  authorLabel?: string;
}

export interface Comment {
  id: string;
  authorName: string;
  avatarText: string;
  avatarBg?: string;
  roleBadge?: string;
  text: string;
  time: string;
  attachment?: Attachment;
  replies?: Comment[];
}

export interface Post {
  id: string;
  authorName: string;
  roleBadge?: string;
  avatarText?: string;
  isOrg?: boolean;
  time: string;
  subtitle?: string;
  title?: string;
  content: string;
  image?: string;
  imageLabel?: string;
  likes: number;
  dislikes: number;
  commentsCount: number;
  views: string;
  type: 'all' | 'uk' | 'chairman';
}
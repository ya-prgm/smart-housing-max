import { apiClient } from '../../../shared/api/client';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { Post, Comment } from '../../../shared/types/feed';

export interface FeedResponseItem {
  id: number;
  author: {
    name: string;
    role: string;
    avatar_url: string | null;
  };
  title: string | null;
  content: string;
  image_url: string | null;
  image_label: string | null;
  likes: number;
  dislikes: number;
  comments_count: number;
  views: number;
  post_type: string;
  created_at: string;
  my_reaction: 'like' | 'dislike' | null;
}

export interface CommentResponseItem {
  id: number;
  author_name: string;
  author_role: string;
  author_avatar: string | null;
  content: string;
  created_at: string;
  replies: CommentResponseItem[];
}

export interface PaginatedComments {
  items: CommentResponseItem[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export const feedApi = {
  async getFeed(type?: 'all' | 'uk' | 'chairman'): Promise<Post[]> {
    const params = type && type !== 'all' ? { type } : {};
    const res = await apiClient.get<FeedResponseItem[]>(ENDPOINTS.FEED.LIST, { params });
    return res.data.map((item) => ({
      id: String(item.id),
      authorName: item.author.name,
      roleBadge: item.author.role === 'chairman' ? 'Председатель' : item.author.role === 'uk_staff' ? 'УК' : undefined,
      avatarText: item.author.name.slice(0, 2).toUpperCase(),
      isOrg: item.author.role === 'uk_staff',
      time: new Date(item.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      title: item.title || undefined,
      content: item.content,
      image: item.image_url || undefined,
      imageLabel: item.image_label || undefined,
      likes: item.likes,
      dislikes: item.dislikes,
      commentsCount: item.comments_count,
      views: String(item.views),
      type: item.post_type === 'announcement' ? 'chairman' : item.post_type === 'report' ? 'uk' : 'all',
    }));
  },

  async getPostById(id: string | number): Promise<Post> {
    const res = await apiClient.get<FeedResponseItem>(ENDPOINTS.FEED.BY_ID(id));
    const item = res.data;
    return {
      id: String(item.id),
      authorName: item.author.name,
      roleBadge: item.author.role === 'chairman' ? 'Председатель' : item.author.role === 'uk_staff' ? 'УК' : undefined,
      avatarText: item.author.name.slice(0, 2).toUpperCase(),
      isOrg: item.author.role === 'uk_staff',
      time: new Date(item.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      title: item.title || undefined,
      content: item.content,
      image: item.image_url || undefined,
      imageLabel: item.image_label || undefined,
      likes: item.likes,
      dislikes: item.dislikes,
      commentsCount: item.comments_count,
      views: String(item.views),
      type: item.post_type === 'announcement' ? 'chairman' : item.post_type === 'report' ? 'uk' : 'all',
    };
  },

  async createPost(payload: { title?: string; content: string; post_type?: string; image_id?: number }): Promise<{ status: string }> {
    const res = await apiClient.post<{ status: string }>(ENDPOINTS.FEED.LIST, {
      title: payload.title || null,
      content: payload.content,
      post_type: payload.post_type || 'announcement',
      image_id: payload.image_id || null,
    });
    return res.data;
  },

  async toggleReaction(postId: string | number, reactionType: 'like' | 'dislike'): Promise<{ likes: number; dislikes: number; my_reaction: 'like' | 'dislike' | null }> {
    const res = await apiClient.post(ENDPOINTS.FEED.REACTIONS(postId), {
      reaction_type: reactionType,
    });
    return res.data;
  },

  async getComments(postId: string | number): Promise<Comment[]> {
    const res = await apiClient.get<PaginatedComments>(ENDPOINTS.FEED.COMMENTS(postId));
    return res.data.items.map((c) => ({
      id: String(c.id),
      authorName: c.author_name,
      avatarText: c.author_name.slice(0, 2).toUpperCase(),
      text: c.content,
      time: new Date(c.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      roleBadge: c.author_role === 'chairman' ? 'Председатель' : c.author_role === 'uk_staff' ? 'УК' : undefined,
    }));
  },

  async addComment(postId: string | number, content: string, parentId?: number): Promise<{ status: string }> {
    const res = await apiClient.post<{ status: string }>(ENDPOINTS.FEED.COMMENTS(postId), {
      content,
      parent_id: parentId || null,
    });
    return res.data;
  },

  async deleteComment(commentId: string | number): Promise<{ status: string }> {
    const res = await apiClient.delete<{ status: string }>(ENDPOINTS.FEED.DELETE_COMMENT(commentId));
    return res.data;
  },
};

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
  images?: string[];
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
  replies?: CommentResponseItem[];
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
    return res.data.map((item) => {
      const isChairman =
        item.author.role === 'chairman' ||
        item.post_type === 'announcement' ||
        (item.author.name && item.author.name.toLowerCase().includes('смирнов'));
      const isUk = item.author.role === 'uk_staff' || !isChairman;

      const postImages =
        item.images && item.images.length > 0
          ? item.images
          : item.image_url
          ? [item.image_url]
          : [];

      return {
        id: String(item.id),
        authorName: item.author.name,
        roleBadge: isChairman ? 'Председатель' : 'УК',
        avatarText: (item.author.name || 'МД').slice(0, 2).toUpperCase(),
        isOrg: isUk,
        time: new Date(item.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        title: item.title || undefined,
        content: item.content,
        image: postImages[0] || item.image_url || undefined,
        images: postImages,
        imageLabel: item.image_label || (postImages.length > 1 ? `${postImages.length} фото` : undefined),
        likes: item.likes,
        dislikes: item.dislikes,
        commentsCount: item.comments_count,
        views: String(item.views),
        type: isChairman ? 'chairman' : 'uk',
      };
    });
  },

  async getPostById(id: string | number): Promise<Post> {
    const res = await apiClient.get<FeedResponseItem>(ENDPOINTS.FEED.BY_ID(id));
    const item = res.data;
    const isChairman =
      item.author.role === 'chairman' ||
      item.post_type === 'announcement' ||
      (item.author.name && item.author.name.toLowerCase().includes('смирнов'));
    const isUk = item.author.role === 'uk_staff' || !isChairman;

    const postImages =
      item.images && item.images.length > 0
        ? item.images
        : item.image_url
        ? [item.image_url]
        : [];

    return {
      id: String(item.id),
      authorName: item.author.name,
      roleBadge: isChairman ? 'Председатель' : 'УК',
      avatarText: (item.author.name || 'МД').slice(0, 2).toUpperCase(),
      isOrg: isUk,
      time: new Date(item.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      title: item.title || undefined,
      content: item.content,
      image: postImages[0] || item.image_url || undefined,
      images: postImages,
      imageLabel: item.image_label || (postImages.length > 1 ? `${postImages.length} фото` : undefined),
      likes: item.likes,
      dislikes: item.dislikes,
      commentsCount: item.comments_count,
      views: String(item.views),
      type: isChairman ? 'chairman' : 'uk',
    };
  },

  async uploadImage(file: File): Promise<{ id: number; url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('context', 'feed');
    const res = await apiClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async createPost(payload: {
    title?: string;
    content: string;
    post_type?: string;
    image_id?: number;
    image_ids?: number[];
    images?: string[];
    image_label?: string;
  }): Promise<{ status: string }> {
    const res = await apiClient.post<{ status: string }>(ENDPOINTS.FEED.LIST, {
      title: payload.title || null,
      content: payload.content,
      post_type: payload.post_type || 'announcement',
      image_id: payload.image_id || null,
      image_ids: payload.image_ids || [],
      images: payload.images || [],
      image_label: payload.image_label || null,
    });
    return res.data;
  },

  async toggleReaction(
    postId: string | number,
    reactionType: 'like' | 'dislike'
  ): Promise<{ likes: number; dislikes: number; my_reaction: 'like' | 'dislike' | null }> {
    const res = await apiClient.post(ENDPOINTS.FEED.REACTIONS(postId), {
      reaction_type: reactionType,
    });
    return res.data;
  },

  async getComments(postId: string | number, sort: string = 'oldest'): Promise<Comment[]> {
    const res = await apiClient.get<PaginatedComments>(ENDPOINTS.FEED.COMMENTS(postId), {
      params: { sort },
    });
    return res.data.items.map((c) => ({
      id: String(c.id),
      authorName: c.author_name,
      avatarText: (c.author_name || 'Ж').slice(0, 2).toUpperCase(),
      text: c.content,
      createdAt: c.created_at,
      time: new Date(c.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      roleBadge: c.author_role === 'chairman' ? 'Председатель' : c.author_role === 'uk_staff' ? 'УК' : undefined,
      replies: (c.replies || []).map((r) => ({
        id: String(r.id),
        authorName: r.author_name,
        avatarText: (r.author_name || 'Ж').slice(0, 2).toUpperCase(),
        text: r.content,
        createdAt: r.created_at,
        time: new Date(r.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        roleBadge: r.author_role === 'chairman' ? 'Председатель' : r.author_role === 'uk_staff' ? 'УК' : undefined,
      })),
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

  async deletePost(postId: string | number): Promise<{ status: string }> {
    const res = await apiClient.delete<{ status: string }>(`/feed/${postId}`);
    return res.data;
  },

  async reportPost(postId: string | number): Promise<{ status: string }> {
    const res = await apiClient.post<{ status: string }>(`/feed/${postId}/report`);
    return res.data;
  },
};

import { apiClient } from '../../../shared/api/client';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { Ticket } from '../../../shared/types/ticket';

export interface TicketResponseItem {
  id: number;
  code: string;
  category: string;
  topic_code: string;
  topic_title: string;
  title: string;
  description: string;
  status: 'active' | 'in_progress' | 'completed' | 'rejected';
  priority: string;
  created_at: string;
  resolved_at: string | null;
  is_my: boolean;
  votes_count: number;
  is_voted: boolean;
  recipients: Array<{
    id: number;
    code: string;
    short_name: string;
    full_name: string;
    category: string;
    icon: string | null;
  }>;
  house_address: string;
  author_full_name: string | null;
  attachments: Array<{
    id: number;
    url: string;
    filename: string;
    size: number;
    mime_type: string;
  }>;
}

export interface TopicItem {
  id: number;
  code: string;
  section_num: number;
  section_title: string;
  title: string;
  full_title: string;
}

export interface RecipientItem {
  id: number;
  code: string;
  short_name: string;
  full_name: string;
  category: string;
  icon: string | null;
}

export interface TopicDetailItem extends TopicItem {
  description: string | null;
  recipients: RecipientItem[];
}

export interface TicketCreatePayload {
  topic_code: string;
  title: string;
  description: string;
  recipient_codes?: string[];
  is_public_in_feed?: boolean;
  attachment_ids?: number[];
}

export const ticketsApi = {
  async getTickets(params?: { status?: string; my?: boolean; search?: string }): Promise<Ticket[]> {
    const res = await apiClient.get<TicketResponseItem[]>(ENDPOINTS.TICKETS.LIST, { params });
    return res.data.map((item) => ({
      id: String(item.id),
      code: item.code,
      category: item.category,
      title: item.title,
      description: item.description,
      status: item.status === 'completed' || item.status === 'rejected' ? 'completed' : item.status === 'in_progress' ? 'in_progress' : 'active',
      date: new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
      isMy: item.is_my,
      votesCount: item.votes_count,
      isVoted: item.is_voted,
      resolvedLabel: item.resolved_at ? `Решено УК • ${item.votes_count} чел` : undefined,
    }));
  },

  async getTicketById(id: string | number): Promise<TicketResponseItem> {
    const res = await apiClient.get<TicketResponseItem>(ENDPOINTS.TICKETS.BY_ID(id));
    return res.data;
  },

  async createTicket(payload: TicketCreatePayload): Promise<TicketResponseItem> {
    const res = await apiClient.post<TicketResponseItem>(ENDPOINTS.TICKETS.LIST, payload);
    return res.data;
  },

  async toggleSupport(id: string | number): Promise<{ ticket_id: number; votes_count: number; is_supported_by_me: boolean }> {
    const res = await apiClient.post(ENDPOINTS.TICKETS.SUPPORT(id));
    return res.data;
  },

  async getTopics(search?: string): Promise<TopicItem[]> {
    const url = search ? ENDPOINTS.TOPICS.SEARCH : ENDPOINTS.TOPICS.LIST;
    const res = await apiClient.get<TopicItem[]>(url, {
      params: search ? { q: search } : undefined,
    });
    return res.data;
  },

  async getTopicByCode(code: string): Promise<TopicDetailItem> {
    const res = await apiClient.get<TopicDetailItem>(ENDPOINTS.TOPICS.BY_CODE(code));
    return res.data;
  },

  async getTopicRecipients(code: string): Promise<RecipientItem[]> {
    const res = await apiClient.get<RecipientItem[]>(`/topics/${code}/recipients`);
    return res.data;
  },

  async getAllRecipients(): Promise<RecipientItem[]> {
    const res = await apiClient.get<RecipientItem[]>('/topics/all-recipients');
    return res.data;
  },

  async updateTicket(id: string | number, payload: { title?: string; description?: string }): Promise<TicketResponseItem> {
    const res = await apiClient.put<TicketResponseItem>(ENDPOINTS.TICKETS.BY_ID(id), payload);
    return res.data;
  },

  async deleteTicket(id: string | number): Promise<void> {
    await apiClient.delete(ENDPOINTS.TICKETS.BY_ID(id));
  },

  async uploadFile(file: File): Promise<{ id: number; url: string; filename: string; mime_type: string; size: number }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('context', 'ticket');
    const res = await apiClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};

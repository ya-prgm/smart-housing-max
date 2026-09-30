import { apiClient } from '../../shared/api/client';
import { PaginatedResponse } from '../../shared/types/api';
import { TicketResponseItem } from '../mobile/tickets/api';
import { HouseCardResponse, HouseDetailResponse } from '../../shared/types/house';

export interface TicketsByStatus {
  active: number;
  in_progress: number;
  completed: number;
  rejected: number;
}

export interface RecentActivityItem {
  type: string;
  house_address: string;
  title: string;
  created_at: string;
}

export interface UkDashboardResponse {
  total_houses: number;
  total_apartments: number;
  total_residents_in_app: number;
  active_tickets: number;
  active_polls: number;
  new_posts_today: number;
  tickets_by_status: TicketsByStatus;
  recent_activity: RecentActivityItem[];
}

export interface ResidentResponse {
  id: number;
  max_user_id: number;
  full_name: string;
  role: 'resident' | 'chairman' | 'uk_staff';
  house_address?: string | null;
  apartment_number?: string | null;
  personal_account?: string | null;
  registered_at: string;
  last_active_at?: string | null;
}

export interface ResidentUpdateRequest {
  role: 'resident' | 'chairman' | 'uk_staff';
  house_id?: number;
  apartment_id?: number;
}

export interface TicketStatusUpdateRequest {
  status: 'active' | 'in_progress' | 'completed' | 'rejected';
  comment?: string | null;
}

export interface UkFeedPostCreate {
  house_id: number;
  title?: string | null;
  content: string;
  post_type?: string;
  image_id?: number | null;
  image_label?: string | null;
}

export interface FeedPostAuthor {
  name: string;
  role: string;
  avatar_url?: string | null;
}

export interface FeedPostResponse {
  id: number;
  author: FeedPostAuthor;
  title?: string | null;
  content: string;
  image_url?: string | null;
  image_label?: string | null;
  likes: number;
  dislikes: number;
  comments_count: number;
  views: number;
  post_type: string;
  created_at: string;
}

export interface UkPollOptionCreate {
  option_text: string;
  subtext?: string | null;
}

export interface UkPollQuestionCreate {
  question_text: string;
  subtext?: string | null;
  question_type: 'single_choice' | 'multiple_choice' | 'text' | 'single' | 'multiple';
  options: UkPollOptionCreate[];
}

export interface UkPollCreate {
  house_id: number;
  title: string;
  description: string;
  deadline: string;
  questions: UkPollQuestionCreate[];
}

export interface JournalEventResponse {
  id: number;
  action: string;
  entity_type: string;
  entity_id?: number | null;
  user_name?: string | null;
  house_address?: string | null;
  details?: Record<string, unknown> | null;
  created_at: string;
}

export interface UkDocumentResponse {
  id: number;
  house_id: number;
  house_address: string;
  title: string;
  file_url: string;
  size: number;
  mime_type: string;
  created_at: string;
}

export interface UkDocumentCreate {
  house_id: number;
  title: string;
  file_id: number;
}

export const ukApi = {
  getDashboard: async (): Promise<UkDashboardResponse> => {
    const { data } = await apiClient.get<UkDashboardResponse>('/uk/dashboard');
    return data;
  },

  getHouses: async (): Promise<HouseCardResponse[]> => {
    const { data } = await apiClient.get<HouseCardResponse[]>('/uk/houses');
    return data;
  },

  getHouseDetails: async (houseId: number | string): Promise<HouseDetailResponse> => {
    const { data } = await apiClient.get<HouseDetailResponse>(`/uk/houses/${houseId}`);
    return data;
  },

  getResidents: async (params?: {
    house_id?: number;
    role?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<ResidentResponse>> => {
    const { data } = await apiClient.get<PaginatedResponse<ResidentResponse>>('/uk/residents', {
      params,
    });
    return data;
  },

  updateResidentRole: async (
    userId: number | string,
    payload: ResidentUpdateRequest
  ): Promise<ResidentResponse> => {
    const { data } = await apiClient.patch<ResidentResponse>(`/uk/residents/${userId}`, payload);
    return data;
  },

  getTickets: async (params?: {
    house_id?: number;
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<TicketResponseItem>> => {
    const { data } = await apiClient.get<PaginatedResponse<TicketResponseItem>>('/uk/tickets', {
      params,
    });
    return data;
  },

  getTicketDetails: async (ticketId: number | string): Promise<TicketResponseItem> => {
    const { data } = await apiClient.get<TicketResponseItem>(`/uk/tickets/${ticketId}`);
    return data;
  },

  updateTicketStatus: async (
    ticketId: number | string,
    payload: TicketStatusUpdateRequest
  ): Promise<{ status: string }> => {
    const { data } = await apiClient.patch<{ status: string }>(
      `/uk/tickets/${ticketId}/status`,
      payload
    );
    return data;
  },

  getFeed: async (houseId: number | string): Promise<FeedPostResponse[]> => {
    const { data } = await apiClient.get<FeedPostResponse[]>('/uk/feed', {
      params: { house_id: houseId }
    });
    return data;
  },

  createFeedPost: async (payload: UkFeedPostCreate): Promise<{ status: string; id?: number }> => {
    const { data } = await apiClient.post<{ status: string; id?: number }>('/uk/feed', payload);
    return data;
  },

  createPoll: async (payload: UkPollCreate): Promise<{ status: string; message: string }> => {
    const { data } = await apiClient.post<{ status: string; message: string }>('/uk/votes', payload);
    return data;
  },

  getDocuments: async (houseId?: number): Promise<UkDocumentResponse[]> => {
    const { data } = await apiClient.get<UkDocumentResponse[]>('/uk/documents', {
      params: houseId ? { house_id: houseId } : undefined,
    });
    return data;
  },

  attachDocument: async (payload: UkDocumentCreate): Promise<{ status: string; message: string }> => {
    const { data } = await apiClient.post<{ status: string; message: string }>('/uk/documents', payload);
    return data;
  },

  getJournal: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<JournalEventResponse>> => {
    const { data } = await apiClient.get<PaginatedResponse<JournalEventResponse>>('/uk/journal', {
      params,
    });
    return data;
  },
};

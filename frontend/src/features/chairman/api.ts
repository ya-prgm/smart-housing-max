import { apiClient } from '../../shared/api/client';

export interface TicketReply {
  id: number;
  ticket_id: number;
  author_id: number;
  author_name: string;
  author_role: string;
  content: string;
  new_status: string | null;
  created_at: string;
}

export interface PollOptionCreate {
  option_text: string;
  subtext?: string;
}

export interface PollQuestionCreate {
  question_text: string;
  subtext?: string;
  question_type: 'single_choice' | 'multiple_choice' | 'text';
  options: PollOptionCreate[];
}

export interface PollCreate {
  title: string;
  description: string;
  deadline_text?: string;
  estimated_time?: string;
  protocol_number?: string;
  questions: PollQuestionCreate[];
}

export interface PollOptionResult {
  id: number;
  option_text: string;
  votes: number;
  percent: number;
}

export interface PollQuestionResult {
  id: number;
  question_text: string;
  question_type: string;
  total_answers: number;
  options: PollOptionResult[];
  text_answers: string[];
}

export interface PollResultsResponse {
  id: number;
  title: string;
  description: string;
  status: string;
  total_participants: number;
  questions: PollQuestionResult[];
}

export const chairmanApi = {
  replyToTicket: async (
    ticketId: number | string,
    content: string,
    newStatus?: string
  ): Promise<TicketReply> => {
    const { data } = await apiClient.post<TicketReply>(
      `/tickets/${ticketId}/reply`,
      { content, new_status: newStatus || null }
    );
    return data;
  },

  createPoll: async (payload: PollCreate): Promise<{ status: string; message: string }> => {
    const { data } = await apiClient.post<{ status: string; message: string }>(
      '/votes',
      payload
    );
    return data;
  },

  getPollResults: async (pollId: number | string): Promise<PollResultsResponse> => {
    const { data } = await apiClient.get<PollResultsResponse>(`/votes/${pollId}/results`);
    return data;
  },

  createPost: async (payload: {
    title?: string;
    content: string;
    post_type?: string;
    image_ids?: number[];
    images?: string[];
    image_label?: string;
  }): Promise<{ status: string }> => {
    const { data } = await apiClient.post<{ status: string }>('/feed', {
      title: payload.title || null,
      content: payload.content,
      post_type: payload.post_type || 'announcement',
      image_ids: payload.image_ids || [],
      images: payload.images || [],
      image_label: payload.image_label || null,
    });
    return data;
  },

  uploadImage: async (file: File): Promise<{ id: number; url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('context', 'feed');
    const { data } = await apiClient.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};

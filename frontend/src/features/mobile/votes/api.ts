import { apiClient } from '../../../shared/api/client';
import {
  PollCardResponse,
  PollDetailResponse,
  PollSubmitRequest,
} from '../../../shared/types/vote';

export const votesApi = {
  getPolls: async (): Promise<PollCardResponse[]> => {
    const { data } = await apiClient.get<PollCardResponse[]>('/votes');
    return data;
  },

  getPoll: async (id: number | string): Promise<PollDetailResponse> => {
    const { data } = await apiClient.get<PollDetailResponse>(`/votes/${id}`);
    return data;
  },

  submitPollAnswers: async (
    pollId: number | string,
    payload: PollSubmitRequest
  ): Promise<{ status: string; message: string }> => {
    const { data } = await apiClient.post<{ status: string; message: string }>(
      `/votes/${pollId}/submit`,
      payload
    );
    return data;
  },
};

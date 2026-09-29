import { apiClient } from '../../../shared/api/client';
import { UserProfile } from '../../../shared/types/user';
import { HouseDetailResponse } from '../../../shared/types/house';

export interface UserUpdatePayload {
  email?: string | null;
  phone?: string | null;
  notifications_enabled?: boolean | null;
}

export const profileApi = {
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await apiClient.get<UserProfile>('/api/v1/users/me');
    return data;
  },

  updateProfile: async (payload: UserUpdatePayload): Promise<UserProfile> => {
    const { data } = await apiClient.patch<UserProfile>('/api/v1/users/me', payload);
    return data;
  },

  getMyHouse: async (): Promise<HouseDetailResponse> => {
    const { data } = await apiClient.get<HouseDetailResponse>('/api/v1/houses/my');
    return data;
  },

  getHouseById: async (houseId: number | string): Promise<HouseDetailResponse> => {
    const { data } = await apiClient.get<HouseDetailResponse>(`/api/v1/houses/${houseId}`);
    return data;
  },
};

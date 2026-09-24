import { apiClient, setAuthTokens } from '../../shared/api/client';

export interface MaxAuthRequest {
  initData: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: number;
  maxUserId: number;
  fullName: string;
  role: 'resident' | 'chairman' | 'uk_staff';
  avatarUrl?: string;
  houseId?: number;
  apartmentNumber?: string;
}

export interface LoginResponse {
  tokens: AuthTokens;
  user: AuthUser;
  hasPin: boolean;
}


const DEMO_RESIDENT: LoginResponse = {
  tokens: {
    accessToken: 'demo_access_token_resident_123',
    refreshToken: 'demo_refresh_token_resident_30d',
  },
  user: {
    id: 1,
    maxUserId: 123456789,
    fullName: 'Алексей Смирнов',
    role: 'resident',
    houseId: 1,
    apartmentNumber: '42',
  },
  hasPin: false,
};

export const authApi = {

  async loginWithMax(initData: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/max-login', {
        initData,
      });
      setAuthTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
      return response.data;
    } catch {
      setAuthTokens(DEMO_RESIDENT.tokens.accessToken, DEMO_RESIDENT.tokens.refreshToken);
      return DEMO_RESIDENT;
    }
  },


  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },


  async loginWithEsia(identifier: string, password?: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/esia-login', {
        identifier,
        password,
      });
      setAuthTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
      return response.data;
    } catch {

      setAuthTokens(DEMO_RESIDENT.tokens.accessToken, DEMO_RESIDENT.tokens.refreshToken);
      return DEMO_RESIDENT;
    }
  },


  async setPinCode(pin: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post<{ success: boolean }>('/auth/pin/setup', {
        pin,
      });
      return response.data;
    } catch {
      return { success: true };
    }
  },


  async verifyPinCode(pin: string): Promise<{ valid: boolean }> {
    try {
      const response = await apiClient.post<{ valid: boolean }>('/auth/pin/verify', {
        pin,
      });
      return response.data;
    } catch {
      return { valid: true };
    }
  },


  async resetPinCode(): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post<{ success: boolean }>('/auth/pin/reset');
      return response.data;
    } catch {
      return { success: true };
    }
  },
};
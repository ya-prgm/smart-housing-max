import { apiClient, setAuthTokens, clearAuthTokens } from '../../shared/api/client';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: number;
  max_user_id: number;
  full_name: string;
  role: 'resident' | 'chairman' | 'uk_staff';
  house_id: number | null;
  house_address: string | null;
  apartment_number: string | null;
}

export interface LoginResponse {
  tokens: AuthTokens;
  user: AuthUser;
  hasPin: boolean;
}

export const authApi = {
  async loginWithMax(initData: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/max-login', {
      initData,
    });
    setAuthTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
    localStorage.setItem('current_user', JSON.stringify(response.data.user));
    return response.data;
  },

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>('/auth/refresh', {
      refreshToken,
    });
    setAuthTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  },

  async loginWithEsia(identifier: string, password?: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/esia-login', {
      identifier: identifier.trim(),
      password: password || 'demo_password',
    });
    setAuthTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
    localStorage.setItem('current_user', JSON.stringify(response.data.user));
    return response.data;
  },

  async setPinCode(pin: string): Promise<{ status: string }> {
    const response = await apiClient.post<{ status: string }>('/auth/pin/setup', {
      pin,
    });
    return response.data;
  },

  async verifyPinCode(pin: string): Promise<{ valid: boolean }> {
    const response = await apiClient.post<{ valid: boolean }>('/auth/pin/verify', {
      pin,
    });
    return response.data;
  },

  async resetPinCode(): Promise<{ status: string }> {
    const response = await apiClient.post<{ status: string }>('/auth/pin/reset');
    clearAuthTokens();
    localStorage.removeItem('current_user');
    return response.data;
  },
};
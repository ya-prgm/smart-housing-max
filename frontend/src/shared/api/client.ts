import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});


export const getAccessToken = (): string | null => {
  if (window.WebApp?.SecureStorage?.getItem) {
    const val = window.WebApp.SecureStorage.getItem('access_token');
    if (val !== undefined && val !== null) {
      return val;
    }
  }
  return localStorage.getItem('access_token');
};

export const getRefreshToken = (): string | null => {
  if (window.WebApp?.SecureStorage?.getItem) {
    const val = window.WebApp.SecureStorage.getItem('refresh_token');
    if (val !== undefined && val !== null) {
      return val;
    }
  }
  return localStorage.getItem('refresh_token');
};

export const setAuthTokens = (accessToken: string, refreshToken: string): void => {
  if (window.WebApp?.SecureStorage?.setItem) {
    window.WebApp.SecureStorage.setItem('access_token', accessToken);
    window.WebApp.SecureStorage.setItem('refresh_token', refreshToken);
  } else {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }
};

export const clearAuthTokens = (): void => {
  if (window.WebApp?.SecureStorage?.removeItem) {
    window.WebApp.SecureStorage.removeItem('access_token');
    window.WebApp.SecureStorage.removeItem('refresh_token');
  } else {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};


apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);


let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/max-login')
      ) {
        clearAuthTokens();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearAuthTokens();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const response = await axios.post<{ accessToken: string; refreshToken: string }>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        setAuthTokens(accessToken, newRefreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthTokens();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
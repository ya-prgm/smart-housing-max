import { AxiosError } from 'axios';

export interface BackendErrorDetail {
  error?: {
    code?: string;
    message?: string;
  };
  detail?: string | { error?: { code?: string; message?: string } };
}

export const getErrorMessage = (error: unknown, fallback = 'Произошла ошибка'): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as BackendErrorDetail | undefined;
    if (data?.error?.message) {
      return data.error.message;
    }
    if (typeof data?.detail === 'string') {
      return data.detail;
    }
    if (typeof data?.detail === 'object' && data.detail?.error?.message) {
      return data.detail.error.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

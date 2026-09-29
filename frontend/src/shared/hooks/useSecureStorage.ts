import { useCallback } from 'react';

export const useSecureStorage = () => {
  const setItem = useCallback(async (key: string, value: string): Promise<void> => {
    const storage = window.WebApp?.SecureStorage;
    if (storage && typeof storage.setItem === 'function') {
      try {
        await storage.setItem(key, value);
        return;
      } catch {}
    }
    localStorage.setItem(key, value);
  }, []);

  const getItem = useCallback(async (key: string): Promise<string | null> => {
    const storage = window.WebApp?.SecureStorage;
    if (storage && typeof storage.getItem === 'function') {
      try {
        const val = await storage.getItem(key);
        if (val !== undefined && val !== null) return val;
      } catch {}
    }
    return localStorage.getItem(key);
  }, []);

  const removeItem = useCallback(async (key: string): Promise<void> => {
    const storage = window.WebApp?.SecureStorage;
    if (storage && typeof storage.removeItem === 'function') {
      try {
        await storage.removeItem(key);
        return;
      } catch {}
    }
    localStorage.removeItem(key);
  }, []);

  return { setItem, getItem, removeItem };
};

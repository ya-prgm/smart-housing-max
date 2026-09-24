import { useEffect, useState, useMemo } from 'react';
import type { MaxUser, MaxWebApp } from '../types/max';

export interface UseMaxBridgeResult {
  webApp: MaxWebApp | null;
  isInsideMax: boolean;
  platform: 'ios' | 'android' | 'desktop' | 'web';
  colorScheme: 'light' | 'dark';
  user: MaxUser | null;
  initData: string;
  closeApp: () => void;
  sendData: (data: string) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
}


const DEV_MOCK_USER: MaxUser = {
  id: 123456789,
  first_name: 'Алексей',
  last_name: 'Смирнов',
  username: 'alex_smirnov',
  photo_url: '',
};

export const useMaxBridge = (): UseMaxBridgeResult => {
  const [webApp, setWebApp] = useState<MaxWebApp | null>(() => {
    return typeof window !== 'undefined' && window.WebApp ? window.WebApp : null;
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.WebApp) {
      setWebApp(window.WebApp);
      try {
        if (typeof window.WebApp.ready === 'function') {
          window.WebApp.ready();
        }
      } catch {
        
      }
    }
  }, []);

  const isInsideMax = useMemo(() => {
    return Boolean(webApp && webApp.initData && webApp.initData.length > 0);
  }, [webApp]);

  const platform = useMemo(() => {
    return webApp?.platform || 'web';
  }, [webApp]);

  const colorScheme = useMemo(() => {
    return webApp?.colorScheme || 'light';
  }, [webApp]);

  const user = useMemo<MaxUser | null>(() => {
    if (webApp?.initDataUnsafe?.user) {
      return webApp.initDataUnsafe.user;
    }
    
    if (import.meta.env.DEV) {
      return DEV_MOCK_USER;
    }
    return null;
  }, [webApp]);

  const initData = useMemo(() => {
    if (webApp?.initData) {
      return webApp.initData;
    }
   
    return import.meta.env.DEV
      ? 'query_id=dev_preview&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B5%D0%B9%22%7D&auth_date=1700000000&hash=dev_mock_hash'
      : '';
  }, [webApp]);

  const closeApp = () => {
    if (webApp && typeof webApp.close === 'function') {
      webApp.close();
    }
  };

  const sendData = (data: string) => {
    if (webApp && typeof webApp.sendData === 'function') {
      webApp.sendData(data);
    }
  };

  const enableClosingConfirmation = () => {
    if (webApp && typeof webApp.enableClosingConfirmation === 'function') {
      webApp.enableClosingConfirmation();
    }
  };

  const disableClosingConfirmation = () => {
    if (webApp && typeof webApp.disableClosingConfirmation === 'function') {
      webApp.disableClosingConfirmation();
    }
  };

  return {
    webApp,
    isInsideMax,
    platform,
    colorScheme,
    user,
    initData,
    closeApp,
    sendData,
    enableClosingConfirmation,
    disableClosingConfirmation,
  };
};
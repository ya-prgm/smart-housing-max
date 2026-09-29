import React, { useEffect } from 'react';

export const MaxUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    try {
      if (window.WebApp) {
        if (typeof window.WebApp.ready === 'function') {
          window.WebApp.ready();
        }
        if (typeof window.WebApp.expand === 'function') {
          window.WebApp.expand();
        }
      }
    } catch {}
  }, []);

  return <>{children}</>;
};

import { useEffect } from 'react';

export const useClosingConfirmation = (enabled = true) => {
  useEffect(() => {
    const webApp = window.WebApp;
    if (!webApp) return;

    if (enabled && typeof webApp.enableClosingConfirmation === 'function') {
      webApp.enableClosingConfirmation();
    } else if (!enabled && typeof webApp.disableClosingConfirmation === 'function') {
      webApp.disableClosingConfirmation();
    }

    return () => {
      if (typeof webApp.disableClosingConfirmation === 'function') {
        webApp.disableClosingConfirmation();
      }
    };
  }, [enabled]);
};

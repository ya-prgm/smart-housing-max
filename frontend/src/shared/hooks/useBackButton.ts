import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useBackButton = (customAction?: () => void) => {
  const navigate = useNavigate();

  useEffect(() => {
    const webApp = window.WebApp;
    if (!webApp?.BackButton) return;

    const handler = () => {
      if (customAction) {
        customAction();
      } else {
        navigate(-1);
      }
    };

    if (typeof webApp.BackButton.show === 'function') {
      webApp.BackButton.show();
    }
    if (typeof webApp.BackButton.onClick === 'function') {
      webApp.BackButton.onClick(handler);
    }

    return () => {
      if (typeof webApp.BackButton?.offClick === 'function') {
        webApp.BackButton.offClick(handler);
      }
      if (typeof webApp.BackButton?.hide === 'function') {
        webApp.BackButton.hide();
      }
    };
  }, [customAction, navigate]);
};

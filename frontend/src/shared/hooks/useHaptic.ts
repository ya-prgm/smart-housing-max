import { useCallback } from 'react';
import type { HapticImpactStyle, HapticNotificationType } from '../types/max';

export const useHaptic = () => {
  const impact = useCallback((style: HapticImpactStyle = 'light') => {
    try {
      if (window.WebApp?.HapticFeedback?.impactOccurred) {
        window.WebApp.HapticFeedback.impactOccurred(style);
      } else if (navigator.vibrate) {
        const durations: Record<HapticImpactStyle, number> = {
          light: 10,
          medium: 20,
          heavy: 30,
          rigid: 15,
          soft: 10,
        };
        navigator.vibrate(durations[style] || 15);
      }
    } catch {
      
    }
  }, []);

  const notification = useCallback((type: HapticNotificationType = 'success') => {
    try {
      if (window.WebApp?.HapticFeedback?.notificationOccurred) {
        window.WebApp.HapticFeedback.notificationOccurred(type);
      } else if (navigator.vibrate) {
        if (type === 'error') {
          navigator.vibrate([30, 40, 30]);
        } else if (type === 'warning') {
          navigator.vibrate([20, 30]);
        } else {
          navigator.vibrate(25);
        }
      }
    } catch {
      
    }
  }, []);

  const selection = useCallback(() => {
    try {
      if (window.WebApp?.HapticFeedback?.selectionChanged) {
        window.WebApp.HapticFeedback.selectionChanged();
      } else if (navigator.vibrate) {
        navigator.vibrate(8);
      }
    } catch {
      
    }
  }, []);

  return {
    impact,
    notification,
    selection,
  };
};
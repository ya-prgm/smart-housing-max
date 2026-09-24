import { useState, useCallback } from 'react';
import { useHaptic } from '../../../shared/hooks/useHaptic';

export const useBiometric = () => {
  const [isAvailable] = useState<boolean>(() => {
    return Boolean(
      window.PublicKeyCredential ||
      (window as unknown as { WebApp?: { BiometricManager?: { isInited: boolean } } }).WebApp?.BiometricManager
    );
  });
  const [isLoading, setIsLoading] = useState(false);
  const { impact, notification } = useHaptic();

  const authenticate = useCallback(async (): Promise<boolean> => {
    impact('light');
    setIsLoading(true);

    try {
      const maxBiometric = (window as unknown as {
        WebApp?: {
          BiometricManager?: {
            authenticate: (params: { reason: string }, cb: (success: boolean) => void) => void;
          };
        };
      }).WebApp?.BiometricManager;

      if (maxBiometric) {
        return await new Promise<boolean>((resolve) => {
          maxBiometric.authenticate(
            { reason: 'Вход в Мой Дом' },
            (success: boolean) => {
              setIsLoading(false);
              if (success) {
                notification('success');
                resolve(true);
              } else {
                notification('error');
                resolve(false);
              }
            }
          );
        });
      }


      if (window.PublicKeyCredential) {
        await new Promise((resolve) => setTimeout(resolve, 350));
        notification('success');
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch {
      notification('error');
      setIsLoading(false);
      return false;
    }
  }, [impact, notification]);

  return {
    isAvailable,
    isLoading,
    authenticate,
  };
};
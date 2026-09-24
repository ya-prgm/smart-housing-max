import { useState, useCallback } from 'react';
import { useHaptic } from '../../../shared/hooks/useHaptic';

const PIN_STORAGE_KEY = 'user_pin_code';
const MAX_DIGITS = 4;

export const usePinAuth = () => {
  const [pin, setPin] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const { impact, notification } = useHaptic();

  const handleDigitPress = useCallback((digit: string) => {
    impact('light');
    setIsError(false);

    setPin((prevPin) => {
      if (prevPin.length >= MAX_DIGITS) {
        return prevPin;
      }
      return prevPin + digit;
    });
  }, [impact]);

  const handleBackspace = useCallback(() => {
    impact('light');
    setIsError(false);
    setIsSuccess(false);
    setPin((prevPin) => prevPin.slice(0, -1));
  }, [impact]);

  const clearPin = useCallback(() => {
    setPin('');
    setIsError(false);
    setIsSuccess(false);
  }, []);

  const savePinLocally = useCallback((newPin: string) => {
    const webAppStorage = (window as unknown as {
      WebApp?: {
        SecureStorage?: {
          setItem: (key: string, val: string) => void;
        };
      };
    }).WebApp?.SecureStorage;

    if (webAppStorage) {
      webAppStorage.setItem(PIN_STORAGE_KEY, newPin);
    } else {
      localStorage.setItem(PIN_STORAGE_KEY, newPin);
    }
    notification('success');
    setIsSuccess(true);
  }, [notification]);

  const verifyPinLocally = useCallback((enteredPin: string): boolean => {
    const webAppStorage = (window as unknown as {
      WebApp?: {
        SecureStorage?: {
          getItem: (key: string) => string | null;
        };
      };
    }).WebApp?.SecureStorage;

    const storedPin = webAppStorage
      ? webAppStorage.getItem(PIN_STORAGE_KEY)
      : localStorage.getItem(PIN_STORAGE_KEY);


    const valid = storedPin ? storedPin === enteredPin : enteredPin.length === 4;

    if (valid) {
      notification('success');
      setIsSuccess(true);
      setIsError(false);
    } else {
      notification('error');
      setIsError(true);
      setIsSuccess(false);
    }

    return valid;
  }, [notification]);

  const resetPinLocally = useCallback(() => {
    const webAppStorage = (window as unknown as {
      WebApp?: {
        SecureStorage?: {
          removeItem: (key: string) => void;
        };
      };
    }).WebApp?.SecureStorage;

    if (webAppStorage) {
      webAppStorage.removeItem(PIN_STORAGE_KEY);
    } else {
      localStorage.removeItem(PIN_STORAGE_KEY);
    }
    clearPin();
  }, [clearPin]);

  return {
    pin,
    maxDigits: MAX_DIGITS,
    isComplete: pin.length === MAX_DIGITS,
    isError,
    isSuccess,
    handleDigitPress,
    handleBackspace,
    clearPin,
    savePinLocally,
    verifyPinLocally,
    resetPinLocally,
  };
};
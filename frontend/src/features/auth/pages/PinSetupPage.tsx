import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PinDots } from '../components/PinDots';
import { PinKeypad } from '../components/PinKeypad';
import { usePinAuth } from '../hooks/usePinAuth';
import { useBiometric } from '../hooks/useBiometric';
import { useHaptic } from '../../../shared/hooks/useHaptic';
import { authApi } from '../api';

export const PinSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { pin, maxDigits, isComplete, handleDigitPress, handleBackspace, clearPin } = usePinAuth();
  const { authenticate } = useBiometric();
  const { impact, notification } = useHaptic();

  const [firstPin, setFirstPin] = useState<string>('');
  const [isConfirmStep, setIsConfirmStep] = useState<boolean>(false);
  const [isMismatchError, setIsMismatchError] = useState<boolean>(false);

  const getDestinationRoute = () => {
    try {
      const raw = localStorage.getItem('current_user');
      if (raw) {
        const u = JSON.parse(raw);
        if (u.role === 'uk_staff') return '/uk/houses';
      }
    } catch {}
    return '/feed';
  };

  useEffect(() => {
    if (isComplete) {
      if (!isConfirmStep) {
        const timer = setTimeout(() => {
          setFirstPin(pin);
          setIsConfirmStep(true);
          clearPin();
        }, 150);
        return () => clearTimeout(timer);
      } else {
        if (pin === firstPin) {
          authApi.setPinCode(pin).then(() => {
            notification('success');
            setTimeout(() => {
              navigate(getDestinationRoute());
            }, 200);
          });
        } else {
          setIsMismatchError(true);
          impact('heavy');
          notification('error');
          const timer = setTimeout(() => {
            setIsMismatchError(false);
            setIsConfirmStep(false);
            setFirstPin('');
            clearPin();
          }, 800);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [isComplete, isConfirmStep, pin, firstPin, clearPin, navigate, impact, notification]);

  const handleSkip = () => {
    impact('light');
    navigate(getDestinationRoute());
  };

  const handleBack = () => {
    impact('light');
    if (isConfirmStep) {
      setIsConfirmStep(false);
      setFirstPin('');
      clearPin();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="bg-[#f7f9ff] font-sans text-[#141c24] flex flex-col min-h-screen select-none">
      <header className="fixed top-0 w-full z-50 pt-[env(safe-area-inset-top,0px)] bg-[#f7f9ff]/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Назад"
              onClick={handleBack}
              className="w-11 h-11 flex items-center justify-center rounded-full text-[#141c24] hover:bg-[#dae3ef]/40 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-[18px] font-semibold text-[#141c24] truncate">
              Установка PIN-code
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1 text-[#6e7881] hover:text-[#141c24] transition-colors"
            >
              <svg
                className="w-[22px] h-[22px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full pt-14 pb-[env(safe-area-inset-bottom,0px)] bg-[#f7f9ff]">
        <div className="flex flex-col w-full max-w-md mx-auto px-4 pb-4 select-none">
          <div className="flex flex-col items-center mt-3 mb-4 text-center">
            <div className="relative w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center p-2 mb-3">
              <img
                alt="Мой Дом"
                className="w-full h-full object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBs3G83VLAI1sbUF2ouAGxm5jvHwTZ2XjZi6RGCOYNd0EZOM_lDw2TdEax1NWuL9xD2l-N2nrm6luAqmlhod_pug4yJGY3TxWJ3L7ewlguEmzAqMPKoD0jwRtvUwL6i_NUq2emAOgI90Uqm3UIH0Wel8pzWivVij_jJlvy_cRj08PbjBdOcv7nQaD-TTQ-qeNu_dZgatvac3yNU3NoZvNgROU6zOmmIgfJtmPHFVcnMHBTKgRTb0kNtXCbuYGAe1k0Y"
              />
              <div className="absolute -bottom-1 -right-1 bg-[#ecf4ff] text-[#006591] rounded-full p-1 shadow-sm flex items-center justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
              </div>
            </div>

            <h2 className="text-[26px] font-bold text-[#141c24] mb-1 tracking-tight">
              {isConfirmStep ? 'Повторите пин-код' : 'Придумайте пин-код'}
            </h2>
            <p className="text-[14px] text-[#3e4850] max-w-[270px]">
              {isMismatchError
                ? 'Коды не совпадают. Попробуйте снова'
                : 'Для быстрого и безопасного входа в приложение Мой Дом'}
            </p>

            <div className="mt-4">
              <PinDots
                length={pin.length}
                maxDigits={maxDigits}
                isSuccess={isComplete && !isMismatchError}
                isError={isMismatchError}
              />
            </div>
          </div>

          <PinKeypad
            onDigitPress={handleDigitPress}
            onBackspace={handleBackspace}
            onBiometricPress={authenticate}
            showBiometric={true}
          />

          <div className="mt-6 flex flex-col items-center gap-2 text-center">
            <button
              type="button"
              onClick={handleSkip}
              className="px-4 py-2.5 rounded-full text-[#0056c4] hover:bg-[#e6effa] transition-colors text-[15px] font-semibold active:scale-98"
            >
              Пропустить установку кода
            </button>
            <button
              type="button"
              onClick={authenticate}
              className="inline-flex items-center gap-1.5 text-[#6e7881] hover:text-[#141c24] text-[13px] transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 11c0 3.5-1.5 6-3 7.5" />
                <path d="M8 15a6 6 0 0 0 7.5 0" />
                <path d="M9 11a3 3 0 0 1 6 0c0 4-1 6.5-2 8.5" />
              </svg>
              <span>Включить Face ID / отпечаток пальца позже</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
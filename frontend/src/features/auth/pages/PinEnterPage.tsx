import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PinDots } from '../components/PinDots';
import { PinKeypad } from '../components/PinKeypad';
import { usePinAuth } from '../hooks/usePinAuth';
import { useBiometric } from '../hooks/useBiometric';
import { useHaptic } from '../../../shared/hooks/useHaptic';

export const PinEnterPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    pin,
    maxDigits,
    isComplete,
    isError,
    isSuccess,
    handleDigitPress,
    handleBackspace,
    verifyPinLocally,
    clearPin,
  } = usePinAuth();

  const { authenticate } = useBiometric();
  const { impact } = useHaptic();

  useEffect(() => {
    if (isComplete) {
      const isValid = verifyPinLocally(pin);
      if (isValid) {
        const timer = setTimeout(() => {
          navigate('/feed');
        }, 150);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          clearPin();
        }, 650);
        return () => clearTimeout(timer);
      }
    }
  }, [isComplete, pin, verifyPinLocally, clearPin, navigate]);

  const handleForgotPin = () => {
    impact('light');
    navigate('/auth/pin-reset');
  };

  return (
    <div className="bg-[#f7f9ff] font-sans text-[#141c24] flex flex-col min-h-screen select-none">
      <main className="flex-1 flex flex-col relative w-full pt-[env(safe-area-inset-top,16px)] pb-[env(safe-area-inset-bottom,16px)] bg-[#f7f9ff]">
        <div className="flex flex-col w-full px-4 py-3 justify-between select-none max-w-md mx-auto">
           
          <div className="flex flex-col items-center text-center mt-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center p-1.5">
                <img
                  alt="Мой Дом"
                  className="w-full h-full object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKQvBRtvB1iVjII3icHl9dEXRdMKjAREl4I3--DsCB1V3ADn_MQOw8g8xMkkOi7iXk4_xUXBdEfuqVHtjjoD4IWbp6Ae-u2P58VAW19sVq19kD6HBxHVAnw_I5G_KYPiljBOUZUMkDvp7_aIGAbnhiDGor5tnxL-2QDHibEK4fNpE6TMCVNNw8kvp95r6Hc86nvxeRZh3twz3KDyVLOqVSBGz9UbXt8pErAspyF6dPbRdLaR7JNAlpxbZ_YJUCwlGk"
                />
              </div>
              <span className="text-[18px] font-semibold text-[#141c24]">Мой Дом</span>
            </div>

            <h2 className="text-[26px] font-bold text-[#141c24] mt-1">Пин-код</h2>
            <p className="text-[14px] text-[#3e4850] mt-1">Введите код быстрого входа</p>

             
            <div className="mt-6 mb-2">
              <PinDots
                length={pin.length}
                maxDigits={maxDigits}
                isSuccess={isSuccess}
                isError={isError}
              />
            </div>
          </div>

           
          <div className="w-full max-w-[320px] mx-auto my-4">
            <PinKeypad
              onDigitPress={handleDigitPress}
              onBackspace={handleBackspace}
              onBiometricPress={authenticate}
              showBiometric={true}
            />
          </div>

           
          <div className="flex flex-col items-center pb-2 pt-1">
            <button
              type="button"
              onClick={handleForgotPin}
              className="px-3 py-2 text-[#0056c4] font-semibold text-[15px] active:opacity-75 transition-opacity rounded-full"
            >
              Забыли короткий код?
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
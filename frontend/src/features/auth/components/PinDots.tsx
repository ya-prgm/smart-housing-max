import React from 'react';

interface PinDotsProps {
  length: number;
  maxDigits?: number;
  isSuccess?: boolean;
  isError?: boolean;
}

export const PinDots: React.FC<PinDotsProps> = ({
  length,
  maxDigits = 4,
  isSuccess = false,
  isError = false,
}) => {
  return (
    <div
      className={`flex items-center justify-center gap-3 h-8 transition-transform duration-200 ${
        isError ? 'animate-[shake_0.4s_ease-in-out]' : ''
      }`}
    >
      {Array.from({ length: maxDigits }).map((_, index) => {
        const isFilled = index < length;

        let dotStyle = 'bg-[#dae3ef] scale-90'; // bg-surface-container-highest / bg-surface-variant

        if (isError) {
          dotStyle = 'bg-[#ba1a1a] scale-100 shadow-sm';
        } else if (isSuccess) {
          dotStyle = 'bg-[#2aabee] scale-100 shadow-sm'; // bg-primary-container
        } else if (isFilled) {
          dotStyle = 'bg-[#006df5] scale-100 shadow-sm'; // bg-secondary-container
        }

        return (
          <div
            key={index}
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-200 transform ${dotStyle}`}
          />
        );
      })}
    </div>
  );
};
import React from 'react';

interface PinKeypadProps {
  onDigitPress: (digit: string) => void;
  onBackspace: () => void;
  onBiometricPress?: () => void;
  showBiometric?: boolean;
}

export const PinKeypad: React.FC<PinKeypadProps> = ({
  onDigitPress,
  onBackspace,
  onBiometricPress,
  showBiometric = true,
}) => {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="grid grid-cols-3 gap-3 w-full px-1 max-w-[340px] mx-auto my-auto select-none">
       
      {digits.map((digit) => (
        <button
          key={digit}
          type="button"
          onClick={() => onDigitPress(digit)}
          className="h-16 rounded-2xl bg-white shadow-sm active:scale-95 active:bg-[#e0e9f4] transition-all flex flex-col items-center justify-center group focus:outline-none"
        >
          <span className="text-[26px] font-bold text-[#141c24] group-active:text-[#006591] leading-none">
            {digit}
          </span>
        </button>
      ))}

       
      <div className="h-16 flex items-center justify-center">
        {showBiometric ? (
          <button
            type="button"
            aria-label="Включить биометрию"
            onClick={onBiometricPress}
            className="w-12 h-12 rounded-full flex items-center justify-center text-[#006591] bg-[#ecf4ff] hover:bg-[#e6effa] transition-all active:scale-90 focus:outline-none"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M12 11c0 3.5-1.5 6-3 7.5" />
              <path d="M8 15a6 6 0 0 0 7.5 0" />
              <path d="M9 11a3 3 0 0 1 6 0c0 4-1 6.5-2 8.5" />
              <path d="M6 12a6 6 0 0 1 12 0c0 3.5-1 6-2 8" />
              <path d="M4 12a8 8 0 0 1 16 0" />
            </svg>
          </button>
        ) : (
          <div className="w-12 h-12" />
        )}
      </div>

       
      <button
        type="button"
        onClick={() => onDigitPress('0')}
        className="h-16 rounded-2xl bg-white shadow-sm active:scale-95 active:bg-[#e0e9f4] transition-all flex flex-col items-center justify-center group focus:outline-none"
      >
        <span className="text-[26px] font-bold text-[#141c24] group-active:text-[#006591] leading-none">
          0
        </span>
      </button>

       
      <div className="h-16 flex items-center justify-center">
        <button
          type="button"
          aria-label="Стереть"
          onClick={onBackspace}
          className="w-14 h-14 rounded-2xl bg-[#ecf4ff] hover:bg-[#e6effa] active:scale-90 transition-all flex items-center justify-center text-[#3e4850] focus:outline-none shadow-sm"
        >
          <svg
            className="w-6 h-6 text-[#0056c4]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
            <line x1="18" y1="9" x2="12" y2="15" />
            <line x1="12" y1="9" x2="18" y2="15" />
          </svg>
        </button>
      </div>
    </div>
  );
};
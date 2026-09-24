import React from 'react';

interface EsiaButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  text?: string;
}

export const EsiaButton: React.FC<EsiaButtonProps> = ({
  onClick,
  isLoading = false,
  text = 'По логину и паролю',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="w-full h-[52px] bg-[#1651D8] hover:bg-[#0A3DB0] active:scale-[0.98] transition-all rounded-[14px] text-white text-[16px] font-medium tracking-normal shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed select-none"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Авторизация...</span>
        </div>
      ) : (
        text
      )}
    </button>
  );
};
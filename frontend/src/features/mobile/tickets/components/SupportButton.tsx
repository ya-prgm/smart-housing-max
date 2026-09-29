import React from 'react';
import { useHaptic } from '../../../../shared/hooks/useHaptic';

interface SupportButtonProps {
  votesCount: number;
  isVoted: boolean;
  onSupport: () => void;
  disabled?: boolean;
}

export const SupportButton: React.FC<SupportButtonProps> = ({
  votesCount,
  isVoted,
  onSupport,
  disabled = false,
}) => {
  const { impact } = useHaptic();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    impact('medium');
    onSupport();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
        isVoted
          ? 'bg-primary text-white shadow-xs'
          : 'bg-sky-50 text-primary hover:bg-sky-100 border border-sky-100'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      <span className="material-symbols-outlined text-[16px]">
        {isVoted ? 'thumb_up' : 'favorite'}
      </span>
      <span>{isVoted ? 'Поддержано' : 'У меня тоже'}</span>
      <span
        className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
          isVoted ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
        }`}
      >
        {votesCount}
      </span>
    </button>
  );
};

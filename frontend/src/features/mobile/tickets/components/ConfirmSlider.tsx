import React, { useState, useRef } from 'react';
import { useHaptic } from '../../../../shared/hooks/useHaptic';

interface ConfirmSliderProps {
  onSuccess: () => void;
  disabled?: boolean;
  label?: string;
  isDestructive?: boolean;
  lockLabel?: string;
}

export const ConfirmSlider: React.FC<ConfirmSliderProps> = ({
  onSuccess,
  disabled = false,
  label = 'Доведите жильца до дома',
  isDestructive = false,
  lockLabel = 'Защита от случайной отправки',
}) => {
  const { impact, notification } = useHaptic();
  const [sliderPos, setSliderPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  const handleStart = (clientX: number) => {
    if (disabled || isSuccess) return;
    setIsDragging(true);
    startXRef.current = clientX - sliderPos;
    impact('light');
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || isSuccess || !containerRef.current) return;
    const max = containerRef.current.clientWidth - 56;
    const diff = clientX - startXRef.current;
    const pos = Math.max(0, Math.min(diff, max));
    setSliderPos(pos);

    if (pos >= max * 0.88) {
      setIsDragging(false);
      setSliderPos(max);
      setIsSuccess(true);
      impact('heavy');
      notification('success');
      onSuccess();
    }
  };

  const handleEnd = () => {
    if (isSuccess) return;
    setIsDragging(false);
    setSliderPos(0);
  };

  const maxDist = containerRef.current ? containerRef.current.clientWidth - 56 : 280;
  const ratio = maxDist > 0 ? sliderPos / maxDist : 0;
  const hintOpacity = Math.max(0, 1 - ratio * 1.8);

  return (
    <div className="flex flex-col gap-2 pt-1 w-full">
      <div
        ref={containerRef}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        className="relative w-full h-14 bg-surface-container-high rounded-full p-1 flex items-center select-none shadow-inner overflow-hidden cursor-pointer"
      >
        <div
          className={`absolute left-0 top-0 bottom-0 rounded-full transition-all pointer-events-none ${
            isDestructive ? 'bg-error/20' : 'bg-primary/20'
          }`}
          style={{ width: `${sliderPos + 52}px` }}
        />

        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none px-12 gap-1.5 transition-opacity"
          style={{ opacity: hintOpacity }}
        >
          <span className="font-label-md text-label-md text-on-surface-variant font-semibold tracking-wide">
            {label}
          </span>
          <div className={`flex items-center select-none ml-0.5 ${isDestructive ? 'text-error/80' : 'text-primary/80'}`}>
            <span className="material-symbols-outlined text-[16px] animate-pulse">chevron_right</span>
            <span className="material-symbols-outlined text-[16px] -ml-2 animate-pulse">chevron_right</span>
            <span className="material-symbols-outlined text-[16px] -ml-2 animate-pulse">chevron_right</span>
            <span className="material-symbols-outlined text-[16px] -ml-2 animate-pulse">chevron_right</span>
          </div>
        </div>

        <div
          className={`absolute right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isDestructive
              ? ratio > 0.85
                ? 'bg-error text-on-error scale-110'
                : 'bg-error-container/40 text-error'
              : ratio > 0.85
              ? 'bg-primary text-on-primary scale-110'
              : 'bg-primary/10 text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isSuccess ? 'check' : 'home'}
          </span>
        </div>

        <div
          onMouseDown={(e) => handleStart(e.clientX)}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          style={{
            transform: `translateX(${sliderPos}px)`,
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
          }}
          className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-md transform active:scale-95 cursor-grab ${
            isDestructive
              ? 'bg-error text-on-error'
              : 'bg-primary text-on-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">
            {isSuccess ? 'check' : 'directions_walk'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-center font-label-sm text-label-sm text-outline">
        <span className="material-symbols-outlined text-[14px]">lock</span>
        <span>{lockLabel}</span>
      </div>
    </div>
  );
};

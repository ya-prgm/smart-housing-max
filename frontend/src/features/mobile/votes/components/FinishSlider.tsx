import React, { useState, useRef } from 'react';
import { useHaptic } from '../../../../shared/hooks/useHaptic';

interface FinishSliderProps {
  onSuccess: () => void;
  disabled?: boolean;
  label?: string;
  successLabel?: string;
}

export const FinishSlider: React.FC<FinishSliderProps> = ({
  onSuccess,
  disabled = false,
  label = 'Проведите для подписания',
  successLabel = 'Подписано электронной подписью',
}) => {
  const { impact, notification } = useHaptic();
  const [sliderPos, setSliderPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  const handleStart = (clientX: number) => {
    if (disabled || isSuccess) return;
    setIsDragging(true);
    startXRef.current = clientX;
    impact('light');
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || isSuccess || !trackRef.current) return;
    const max = trackRef.current.clientWidth - 56;
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

  return (
    <div
      ref={trackRef}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
      className={`relative w-full h-14 rounded-full p-1.5 flex items-center select-none overflow-hidden transition-colors ${
        isSuccess
          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
          : 'bg-slate-100 border border-slate-200'
      }`}
    >
      <div
        className="absolute inset-y-0 left-0 bg-primary/10 rounded-full pointer-events-none transition-all"
        style={{ width: `${sliderPos + 48}px` }}
      />

      <span
        className={`w-full text-center text-[13px] font-semibold tracking-wide transition-opacity ${
          isDragging ? 'opacity-30' : 'opacity-100'
        } ${isSuccess ? 'text-white' : 'text-slate-500'}`}
      >
        {isSuccess ? successLabel : label}
      </span>

      <div
        onMouseDown={(e) => handleStart(e.clientX)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        style={{ transform: `translateX(${sliderPos}px)` }}
        className={`absolute left-1.5 top-1.5 w-11 h-11 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-md transition-transform duration-75 ${
          isSuccess
            ? 'bg-white text-emerald-600'
            : 'bg-primary text-white active:scale-95'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">
          {isSuccess ? 'check' : 'arrow_forward'}
        </span>
      </div>
    </div>
  );
};

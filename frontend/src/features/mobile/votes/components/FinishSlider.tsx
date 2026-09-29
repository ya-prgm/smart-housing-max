import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  label = 'Проведите жильца вправо для завершения',
  successLabel = 'Голос отправлен!',
}) => {
  const { impact, notification } = useHaptic();
  const [sliderPos, setSliderPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const maxPosRef = useRef(0);

  const calculateMax = useCallback(() => {
    if (trackRef.current) {
      maxPosRef.current = Math.max(0, trackRef.current.clientWidth - 58);
    }
  }, []);

  useEffect(() => {
    calculateMax();
    window.addEventListener('resize', calculateMax);
    return () => window.removeEventListener('resize', calculateMax);
  }, [calculateMax]);

  const handleStart = (clientX: number) => {
    if (disabled || isCompleted) return;
    calculateMax();
    setIsDragging(true);
    startXRef.current = clientX - sliderPos;
    impact('light');
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || isCompleted || maxPosRef.current <= 0) return;
    const diff = clientX - startXRef.current;
    const pos = Math.max(0, Math.min(diff, maxPosRef.current));
    setSliderPos(pos);

    if (pos >= maxPosRef.current - 4) {
      setIsDragging(false);
      setSliderPos(maxPosRef.current);
      setIsCompleted(true);
      impact('heavy');
      notification('success');
      onSuccess();
    }
  };

  const handleEnd = () => {
    if (isCompleted) return;
    setIsDragging(false);
    setSliderPos(0);
  };

  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        handleMove(e.touches[0].clientX);
      }
    };
    const onTouchEnd = () => {
      if (isDragging) {
        handleEnd();
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };
    const onMouseUp = () => {
      if (isDragging) {
        handleEnd();
      }
    };

    if (isDragging) {
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={trackRef}
      className={`relative w-full h-[58px] rounded-full p-1 flex items-center select-none touch-none overflow-hidden transition-colors shadow-inner ${
        isCompleted
          ? 'bg-emerald-600 text-white'
          : 'bg-[#e6effa] border border-slate-200/80'
      }`}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 rounded-full pointer-events-none transition-all duration-75 ${
          isCompleted ? 'bg-emerald-600 w-full' : 'bg-[#c9e6ff]'
        }`}
        style={{ width: isCompleted ? '100%' : `${sliderPos + 54}px` }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-12 z-0">
        <span
          className={`text-[12px] sm:text-[13px] font-medium tracking-wide flex items-center gap-1 transition-opacity ${
            isDragging ? 'opacity-30' : 'opacity-80'
          } ${isCompleted ? 'text-white font-semibold' : 'text-slate-600'}`}
        >
          {isCompleted ? (
            successLabel
          ) : (
            <>
              <span>{label}</span>
              <span className="opacity-50 tracking-tighter text-[11px]">&gt;&gt;&gt;&gt;</span>
            </>
          )}
        </span>
      </div>

      <div className="absolute right-2 w-10 h-10 rounded-full bg-white/80 border border-slate-200/60 flex items-center justify-center text-primary pointer-events-none shadow-xs z-0">
        <span className="material-symbols-outlined text-[22px]">home</span>
      </div>

      <div
        onMouseDown={(e) => handleStart(e.clientX)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        style={{
          transform: `translateX(${sliderPos}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s ease-out',
        }}
        className={`relative z-10 w-[50px] h-[50px] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-md active:scale-95 ${
          isCompleted
            ? 'bg-white text-emerald-600'
            : 'bg-primary text-white'
        }`}
      >
        <span className="material-symbols-outlined text-[26px]">
          {isCompleted ? 'done' : 'directions_walk'}
        </span>
      </div>
    </div>
  );
};

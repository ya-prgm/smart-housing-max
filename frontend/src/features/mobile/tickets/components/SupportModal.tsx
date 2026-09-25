import React, { useState, useRef, useEffect } from 'react';
import { useHaptic } from '../../../../shared/hooks/useHaptic';

interface SupportModalProps {
  isOpen: boolean;
  ticketTitle: string;
  ticketCode: string;
  currentVotes: number;
  onClose: () => void;
  onConfirm: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  ticketTitle,
  ticketCode,
  currentVotes,
  onClose,
  onConfirm,
}) => {
  const { impact, notification } = useHaptic();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [sliderPos, setSliderPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  useEffect(() => {
    if (!isOpen) {
      setIsConfirmed(false);
      setSliderPos(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTouchStart = (clientX: number) => {
    if (isConfirmed) return;
    setIsDragging(true);
    startXRef.current = clientX;
    impact('light');
  };

  const handleTouchMove = (clientX: number) => {
    if (!isDragging || isConfirmed || !containerRef.current) return;
    const maxDistance = containerRef.current.clientWidth - 56;
    const diff = clientX - startXRef.current;
    const newPos = Math.max(0, Math.min(diff, maxDistance));
    setSliderPos(newPos);

    if (newPos >= maxDistance * 0.88) {
      setIsDragging(false);
      setIsConfirmed(true);
      setSliderPos(maxDistance);
      notification('success');
      onConfirm();
    }
  };

  const handleTouchEnd = () => {
    if (isConfirmed) return;
    setIsDragging(false);
    setSliderPos(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg mx-auto bg-white rounded-t-[28px] shadow-2xl p-4 pb-8 flex flex-col items-center">
        <div className="w-12 h-1.5 rounded-full bg-slate-200 mb-4" />

        <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-primary mb-2 shadow-xs relative">
          <span className="material-symbols-outlined text-[30px]">how_to_reg</span>
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center text-[10px] font-bold">
            +1
          </span>
        </div>

        <h2 className="text-[20px] font-bold text-slate-900 text-center mb-1 tracking-tight">
          У вас такая же проблема?
        </h2>
        <p className="text-[13px] text-slate-500 text-center max-w-xs mb-4">
          Вы подтверждаете, что в вашей квартире или подъезде наблюдается аналогичная неисправность:
        </p>

        <div className="w-full bg-slate-50 rounded-2xl p-3.5 mb-4 flex flex-col gap-1 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-semibold">
              Обращение {ticketCode}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-primary font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              В работе
            </span>
          </div>
          <p className="text-[14px] font-semibold text-slate-900 mt-1">{ticketTitle}</p>
          <div className="flex items-center justify-between text-slate-500 text-[12px] mt-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[17px] text-secondary">group</span>
              <span>
                <strong className="text-slate-800 font-semibold">
                  {currentVotes + (isConfirmed ? 1 : 0)} соседей
                </strong>{' '}
                уже с вами
              </span>
            </div>
            <span className="text-[11px]">УК «ЖилКомФорт»</span>
          </div>
        </div>

        {!isConfirmed ? (
          <div className="w-full flex flex-col gap-2">
            <div
              ref={containerRef}
              className="relative w-full h-14 bg-slate-100 rounded-full p-1 flex items-center select-none shadow-inner overflow-hidden"
              onTouchStart={(e) => handleTouchStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleTouchMove(e.touches[0].clientX)}
              onTouchEnd={handleTouchEnd}
              onMouseDown={(e) => handleTouchStart(e.clientX)}
              onMouseMove={(e) => isDragging && handleTouchMove(e.clientX)}
              onMouseUp={handleTouchEnd}
            >
              <div
                className="absolute left-0 top-0 bottom-0 bg-sky-200/50 rounded-full pointer-events-none"
                style={{ width: `${sliderPos + 48}px` }}
              />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-12 gap-1">
                <span className="text-[13px] text-slate-600 font-semibold tracking-wide">
                  Доведите жильца до дома
                </span>
                <span className="material-symbols-outlined text-[16px] text-primary animate-pulse">
                  chevron_right
                </span>
              </div>

              <div className="absolute right-3 w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">home</span>
              </div>

              <div
                className="relative z-10 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-md transform transition-transform active:scale-95 cursor-grab"
                style={{
                  transform: `translateX(${sliderPos}px)`,
                  transition: isDragging ? 'none' : 'transform 0.25s ease',
                }}
              >
                <span className="material-symbols-outlined text-[24px]">directions_walk</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1 text-center text-[11px] text-slate-400">
              <span className="material-symbols-outlined text-[13px]">lock</span>
              <span>Защита от случайной отправки</span>
            </div>
          </div>
        ) : (
          <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-2 flex flex-col items-center text-center animate-fadeIn">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[22px]">check</span>
            </div>
            <p className="text-[15px] font-semibold text-slate-900">
              Голос учтён! Приоритет повышен.
            </p>
            <p className="text-[12px] text-slate-500">Уведомление отправлено дежурному инженеру.</p>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className={`w-full mt-3 h-11 rounded-xl font-semibold text-[14px] transition-colors ${
            isConfirmed
              ? 'bg-primary text-white shadow-md'
              : 'bg-transparent hover:bg-slate-100 text-slate-600'
          }`}
        >
          {isConfirmed ? 'Готово' : 'Отмена / Закрыть'}
        </button>
      </div>
    </div>
  );
};
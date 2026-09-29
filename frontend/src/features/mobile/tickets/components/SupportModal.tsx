import React, { useState, useEffect } from 'react';
import { useHaptic } from '../../../../shared/hooks/useHaptic';
import { ConfirmSlider } from './ConfirmSlider';

interface SupportModalProps {
  isOpen: boolean;
  ticketTitle: string;
  ticketCode: string;
  category?: string;
  currentVotes: number;
  onClose: () => void;
  onConfirm: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  ticketTitle,
  ticketCode,
  category = 'Реестр дома',
  currentVotes,
  onClose,
  onConfirm,
}) => {
  const { notification } = useHaptic();
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsConfirmed(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSliderSuccess = () => {
    setIsConfirmed(true);
    notification('success');
    setTimeout(() => {
      onConfirm();
    }, 450);
  };

  const formattedCode = ticketCode.startsWith('#') ? ticketCode : `#${ticketCode}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="w-full max-w-[430px] mx-auto bg-surface-container-lowest rounded-t-[28px] shadow-2xl p-space-lg flex flex-col items-center relative transform transition-transform duration-300 z-10">
        <div className="w-12 h-1.5 rounded-full bg-outline-variant/60 mb-space-md" />

        <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-space-sm shadow-sm relative">
          <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            how_to_reg
          </span>
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-label-sm text-[10px]">
            +1
          </span>
        </div>

        <h2 className="font-headline-lg text-headline-lg text-on-surface text-center mb-space-xs tracking-tight">
          У вас такая же проблема?
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-xs mb-space-md">
          Вы подтверждаете, что в вашей квартире или подъезде наблюдается аналогичная неисправность:
        </p>

        <div className="w-full bg-surface-container-low rounded-2xl p-space-md mb-space-md flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold tracking-wide">
              Заявка {formattedCode}
            </span>
            <span className="inline-flex items-center gap-1 text-[12px] font-label-sm text-primary font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              В работе
            </span>
          </div>

          <p className="font-label-lg text-label-lg text-on-surface mt-1 font-semibold">
            «{ticketTitle}»
          </p>

          <div className="flex items-center justify-between mt-space-xs pt-space-xs text-on-surface-variant font-body-sm text-body-sm">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-tertiary">group</span>
              <span className="font-semibold text-on-surface">
                {currentVotes + (isConfirmed ? 1 : 0)} соседей
              </span>{' '}
              уже с вами
            </div>
            <span className="text-[12px] text-on-surface-variant/80 truncate max-w-[120px]">{category}</span>
          </div>
        </div>

        {!isConfirmed ? (
          <ConfirmSlider
            onSuccess={handleSliderSuccess}
            label="Доведите жильца до дома"
            lockLabel="Защита от случайной отправки"
          />
        ) : (
          <div className="w-full bg-surface-container-high rounded-2xl p-space-md mb-space-sm flex flex-col items-center text-center animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[22px]">check</span>
            </div>
            <p className="font-label-lg text-label-lg text-on-surface font-semibold">Голос учтён! Приоритет повышен.</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Уведомление отправлено дежурному инженеру.</p>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full h-11 rounded-xl bg-transparent hover:bg-surface-variant/40 text-on-surface-variant font-label-lg transition-colors flex items-center justify-center mt-2 cursor-pointer"
        >
          Отмена / Закрыть
        </button>
      </div>
    </div>
  );
};
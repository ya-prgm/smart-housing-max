import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHaptic } from '../../../../shared/hooks/useHaptic';

export const VoteFinishPage: React.FC = () => {
  const navigate = useNavigate();
  const { impact, notification } = useHaptic();

  const [sliderPos, setSliderPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  const handleStart = (clientX: number) => {
    if (isSuccess) return;
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
    }
  };

  const handleEnd = () => {
    if (isSuccess) return;
    setIsDragging(false);
    setSliderPos(0);
  };

  return (
    <div className="bg-[#f7f9ff] text-slate-900 min-h-screen flex flex-col relative select-none pb-20">
      <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 pt-safe">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Назад"
              onClick={() => navigate(-1)}
              className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight truncate">
              Завершение опроса
            </h1>
          </div>
        </div>
      </header>

      <div className="px-4 py-3 bg-white border-b border-slate-100 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-slate-800 flex items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-[17px]">check_circle</span>
            Все вопросы пройдены
          </span>
          <span className="font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full text-[11px]">
            100% завершено
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full w-full" />
        </div>
      </div>

      <main className="px-4 pt-6 flex flex-col items-center max-w-[430px] mx-auto w-full text-center">
        <div className="w-18 h-18 rounded-full bg-sky-100 flex items-center justify-center mb-3 text-primary shadow-xs">
          <span className="material-symbols-outlined text-[36px]">mark_email_read</span>
        </div>

        <h2 className="text-[22px] font-bold text-slate-900 tracking-tight mb-1">
          Вы ответили на все вопросы!
        </h2>
        <p className="text-[13px] text-slate-500 max-w-xs mb-5">
          Проверьте сводку и подтвердите отправку результатов в реестр дома
        </p>

        <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-2.5 text-left mb-6">
          <div className="flex items-center gap-2 p-2 bg-sky-50 rounded-xl text-primary font-semibold text-[13px]">
            <span className="material-symbols-outlined text-[20px]">how_to_vote</span>
            <span className="truncate">Установка шлагбаума и видеонаблюдения</span>
          </div>

          <div className="flex items-center justify-between text-[13px] py-0.5 border-b border-slate-100">
            <span className="text-slate-400">Собственник</span>
            <span className="font-semibold text-slate-900">Смирнов А. С. (кв. 48)</span>
          </div>
          <div className="flex items-center justify-between text-[13px] py-0.5 border-b border-slate-100">
            <span className="text-slate-400">Заполнено</span>
            <span className="font-bold text-primary">3 из 3 вопросов</span>
          </div>
          <div className="flex items-center justify-between text-[13px] py-0.5">
            <span className="text-slate-400">Дата фиксации</span>
            <span className="font-medium text-slate-600">Сегодня, только что</span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          <div
            ref={trackRef}
            className="relative w-full h-14 bg-slate-100 rounded-full p-1 flex items-center select-none shadow-inner overflow-hidden cursor-pointer"
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            onTouchEnd={handleEnd}
            onMouseDown={(e) => handleStart(e.clientX)}
            onMouseMove={(e) => isDragging && handleMove(e.clientX)}
            onMouseUp={handleEnd}
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-sky-200/50 rounded-full pointer-events-none"
              style={{ width: `${sliderPos + 48}px` }}
            />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-12 gap-1">
              <span className="text-[13px] text-slate-600 font-semibold tracking-wide">
                Проведите жильца вправо
              </span>
              <span className="text-primary font-bold text-[12px] tracking-tighter">&gt;&gt;&gt;</span>
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

          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
            <span className="material-symbols-outlined text-[13px]">lock</span>
            <span>Сдвиньте бегунок вправо до иконки дома для официальной отправки</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 text-primary font-semibold text-[13px] hover:underline"
        >
          Вернуться и проверить ответы
        </button>
      </main>
      {isSuccess && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex flex-col justify-end p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-5 text-center shadow-xl max-w-[400px] mx-auto w-full flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[36px]">task_alt</span>
            </div>
            <h3 className="text-[18px] font-bold text-slate-900 mb-1">Голос успешно принят!</h3>
            <p className="text-[13px] text-slate-500 mb-5 leading-relaxed">
              Ваши ответы подписаны простой электронной подписью и внесены в протокол № 48-ОСС. Спасибо за участие!
            </p>
            <button
              type="button"
              onClick={() => navigate('/votes')}
              className="w-full h-12 bg-primary text-white font-semibold rounded-full active:scale-95 transition-transform"
            >
              Вернуться к опросам
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
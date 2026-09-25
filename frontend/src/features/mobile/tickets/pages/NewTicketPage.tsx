import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHaptic } from '../../../../shared/hooks/useHaptic';

export const NewTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const { impact, notification } = useHaptic();

  const [topic, setTopic] = useState('2.16 Прорыв трубы / стояка отопления или ГВС');
  const [description, setDescription] = useState(
    'В ванной комнате капает стояк отопления на стыке труб, требуется срочный выезд аварийной бригады. Капает примерно 1 капля в 2 секунды, подставили емкость.'
  );
  const [publishInFeed, setPublishInFeed] = useState(true);

  const [recipients, setRecipients] = useState([
    { id: 'uo', name: 'ООО «ЖилКомФорт»', role: 'Управляющая организация • Регламент 12 ч.', icon: 'corporate_fare', checked: true },
    { id: 'rso', name: 'ПАО «Т Плюс / Водоканал»', role: 'Ресурсоснабжающая организация', icon: 'water_drop', checked: true },
    { id: 'gzhi', name: 'Госжилинспекция (ГЖИ)', role: 'Государственный надзор и контроль', icon: 'policy', checked: false },
    { id: 'oms', name: 'Управление ЖКХ района', role: 'Орган местного самоуправления', icon: 'account_balance', checked: false },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [sliderPos, setSliderPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  const toggleRecipient = (id: string) => {
    impact('light');
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, checked: !r.checked } : r))
    );
  };

  const selectedCount = recipients.filter((r) => r.checked).length;
  const selectedRecipientNames = recipients
    .filter((r) => r.checked)
    .map((r) => r.name)
    .join(', ');

  const handleTouchStart = (clientX: number) => {
    if (isConfirmed) return;
    setIsDragging(true);
    startXRef.current = clientX;
    impact('light');
  };

  const handleTouchMove = (clientX: number) => {
    if (!isDragging || isConfirmed || !sliderContainerRef.current) return;
    const maxDistance = sliderContainerRef.current.clientWidth - 56;
    const diff = clientX - startXRef.current;
    const newPos = Math.max(0, Math.min(diff, maxDistance));
    setSliderPos(newPos);

    if (newPos >= maxDistance * 0.88) {
      setIsDragging(false);
      setIsConfirmed(true);
      setSliderPos(maxDistance);
      impact('heavy');
      notification('success');

      setTimeout(() => {
        setIsModalOpen(false);
        navigate('/tickets');
      }, 700);
    }
  };

  const handleTouchEnd = () => {
    if (isConfirmed) return;
    setIsDragging(false);
    setSliderPos(0);
  };

  const openConfirmation = () => {
    impact('medium');
    setIsConfirmed(false);
    setSliderPos(0);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-[#f7f9ff] text-slate-900 min-h-screen flex flex-col relative select-none">
      <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 pt-safe">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Назад"
              onClick={() => navigate(-1)}
              className="w-11 h-11 flex items-center justify-center rounded-full text-slate-800 hover:bg-slate-100 active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-[18px] font-semibold text-slate-900 tracking-tight truncate">
              Новое обращение
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pt-3 pb-12 flex flex-col gap-5 max-w-[430px] mx-auto w-full">
        <div className="flex items-center justify-between bg-sky-50 px-3.5 py-2.5 rounded-xl border border-sky-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-sky-200/60 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[20px]">apartment</span>
            </div>
            <div className="truncate">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Объект обращения
              </p>
              <p className="text-[13px] text-slate-900 font-semibold truncate">
                ул. Баумана, д. 12, кв. 48
              </p>
            </div>
          </div>
          <span className="text-[12px] text-primary font-semibold shrink-0">Собственник</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] flex items-center justify-center font-bold">
                1
              </span>
              <label className="text-[14px] font-bold text-slate-900">Тема обращения</label>
            </div>
            <span className="text-[11px] text-primary flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[13px]">tune</span> Классификатор ЖКХ
            </span>
          </div>

          <div className="relative bg-white rounded-2xl shadow-xs border border-slate-200/80 p-2.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-transparent text-[14px] text-slate-900 outline-none font-medium"
              />
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between bg-sky-50/70 rounded-xl px-2.5 py-1.5">
              <span className="px-1.5 py-0.5 rounded bg-primary text-white text-[10px] font-bold">
                2.16
              </span>
              <span className="text-[11px] text-slate-600 truncate ml-2">
                Внутридомовая инженерная инфраструктура
              </span>
              <span className="material-symbols-outlined text-primary text-[17px] ml-1">
                check_circle
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] flex items-center justify-center font-bold">
                2
              </span>
              <label className="text-[14px] font-bold text-slate-900">Адресаты</label>
            </div>
            <span className="text-[11px] text-primary font-medium">
              Выбрано: {selectedCount} из {recipients.length}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {recipients.map((recip) => (
              <div
                key={recip.id}
                onClick={() => toggleRecipient(recip.id)}
                className={`cursor-pointer flex items-center justify-between p-3 rounded-2xl bg-white border-2 transition-all shadow-xs ${
                  recip.checked ? 'border-primary' : 'border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[22px]">{recip.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[14px] font-semibold text-slate-900 truncate">
                      {recip.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">{recip.role}</p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 ml-2 transition-colors ${
                    recip.checked
                      ? 'border-primary bg-primary text-white'
                      : 'border-slate-300 bg-white text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px] font-bold">check</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] flex items-center justify-center font-bold">
                3
              </span>
              <label className="text-[14px] font-bold text-slate-900">Подробное описание</label>
            </div>
            <span className="text-[11px] text-slate-400">{description.length} / 1000</span>
          </div>

          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white rounded-2xl shadow-xs border border-slate-200/80 p-3 text-[13px] text-slate-800 outline-none leading-relaxed focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] flex items-center justify-center font-bold">
                4
              </span>
              <label className="text-[14px] font-bold text-slate-900">Фото или документы</label>
            </div>
            <span className="text-[11px] text-slate-400">1 файл</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="relative h-24 rounded-2xl overflow-hidden bg-slate-100 shadow-xs">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_lnXva2JoP_PCCa01iYwAC-Ap1ZoPJBiExRxD-RJb5aRnubIDtOWDSmTSOXk3BQkJopxvwdSLHW1JNv1D_6Rqc3kt_C4RUgRxfw5c6KbEBFSJm_-ed81EotMBUqQtbh-sjQJEao1FJKgzGN42evPAfSyS1JlfHyDnQX0nTvWXm2oBAV5ITufs1GbMP-6b70AJ8T5kW9uEFK3ec0TsmUC_aoC-j4uHpd3OULIXmgw9QRNQ3V2mND8"
                alt="Вложение"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-2">
                <span className="text-[11px] text-white truncate">стояк_ванная.jpg</span>
              </div>
            </div>

            <button
              type="button"
              className="h-24 rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/50 flex flex-col items-center justify-center text-primary gap-1 active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">add_photo_alternate</span>
              <span className="text-[11px] font-semibold">Добавить</span>
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-primary shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">public</span>
            </div>
            <div>
              <span className="text-[13px] font-bold text-slate-900 leading-tight">
                Опубликовать в ленте дома
              </span>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                Обезличенно, чтобы соседи могли присоединиться
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={publishInFeed}
            onChange={(e) => setPublishInFeed(e.target.checked)}
            className="w-5 h-5 rounded text-primary focus:ring-primary shrink-0 ml-2"
          />
        </div>

        <button
          type="button"
          onClick={openConfirmation}
          className="w-full h-14 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 active:scale-[0.98] transition-all font-semibold text-[15px] mt-2 cursor-pointer"
        >
          <span>Отправить обращение</span>
          <span className="material-symbols-outlined text-[20px]">send</span>
        </button>

        <p className="text-center text-[11px] text-slate-400 px-2 leading-tight">
          Нажимая «Отправить обращение», вы подтверждаете регламентную регистрацию в Единой системе ЖКХ с фиксацией срока ответа
        </p>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

          <div className="relative z-10 w-full max-w-lg mx-auto bg-white rounded-t-[28px] shadow-2xl p-4 pt-3 pb-8 flex flex-col gap-3.5">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-1" />

            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-primary mb-1">
                <span className="material-symbols-outlined text-[28px]">mark_email_read</span>
              </div>
              <h2 className="text-[19px] font-bold text-slate-900 tracking-tight">
                Вы уверены, что хотите отправить обращение?
              </h2>
              <p className="text-[12px] text-slate-500 max-w-sm">
                После подтверждения обращение будет немедленно зарегистрирована и направлена исполнителю, а также опубликована в ленте дома.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 flex flex-col gap-2 border border-slate-100 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Адресат</span>
                <span className="font-medium text-slate-900 text-right truncate max-w-[210px]">
                  {selectedRecipientNames || 'ООО «ЖилКомФорт»'}
                </span>
              </div>
              <div className="h-[1px] bg-slate-200/60 w-full" />

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Тема</span>
                <span className="font-semibold text-slate-900 text-right max-w-[210px] truncate">
                  «{topic}»
                </span>
              </div>
              <div className="h-[1px] bg-slate-200/60 w-full" />

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Прикреплено</span>
                <div className="flex items-center gap-1 text-slate-800 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-primary">attach_file</span>
                  <span>1 файл (фото)</span>
                </div>
              </div>
              <div className="h-[1px] bg-slate-200/60 w-full" />

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Статус</span>
                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-semibold">
                  Будет присвоен «В обработке»
                </span>
              </div>
            </div>

            {!isConfirmed ? (
              <div className="flex flex-col gap-2 pt-1">
                <div
                  ref={sliderContainerRef}
                  className="relative w-full h-14 bg-slate-100 rounded-full p-1 flex items-center select-none shadow-inner overflow-hidden cursor-pointer"
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

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-12 gap-1.5">
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
              <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-emerald-700 font-semibold text-[14px] animate-fadeIn">
                <span className="material-symbols-outlined text-[22px]">check_circle</span>
                <span>Обращение успешно зарегистрировано!</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full h-11 rounded-xl bg-transparent hover:bg-slate-100 text-slate-600 text-[14px] font-semibold transition-colors"
            >
              Отмена / Редактировать
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
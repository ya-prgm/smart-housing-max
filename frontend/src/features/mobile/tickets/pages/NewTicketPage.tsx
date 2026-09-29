import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useHaptic } from '../../../../shared/hooks/useHaptic';
import { useProfile } from '../../profile/hooks/useProfile';
import { useToast } from '../../../../shared/hooks/useToast';
import { ticketsApi } from '../api';

export const NewTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { impact, notification } = useHaptic();
  const { profile } = useProfile();
  const { showToast } = useToast();

  const [topicCode, setTopicCode] = useState('2.16');
  const [topic, setTopic] = useState('Прорыв трубы / стояка отопления или ГВС');
  const [description, setDescription] = useState(
    'В ванной комнате капает стояк отопления на стыке труб, требуется срочный выезд аварийной бригады.'
  );
  const [publishInFeed, setPublishInFeed] = useState(true);

  const [recipients, setRecipients] = useState([
    { id: 'uo', code: 'uk', name: 'ООО «ЖилКомФорт»', role: 'Управляющая организация • Регламент 12 ч.', icon: 'corporate_fare', checked: true },
    { id: 'rso', code: 'rso', name: 'ПАО «Т Плюс / Водоканал»', role: 'Ресурсоснабжающая организация', icon: 'water_drop', checked: true },
    { id: 'gzhi', code: 'gzhi', name: 'Госжилинспекция (ГЖИ)', role: 'Государственный надзор и контроль', icon: 'policy', checked: false },
    { id: 'oms', code: 'oms', name: 'Управление ЖКХ района', role: 'Орган местного самоуправления', icon: 'account_balance', checked: false },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [sliderPos, setSliderPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  const { data: topics = [] } = useQuery({
    queryKey: ['topics'],
    queryFn: () => ticketsApi.getTopics(),
  });

  const createTicketMutation = useMutation({
    mutationFn: () =>
      ticketsApi.createTicket({
        topic_code: topicCode,
        title: topic,
        description,
        recipient_codes: recipients.filter((r) => r.checked).map((r) => r.code),
        is_public_in_feed: publishInFeed,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      showToast('Обращение успешно зарегистрировано в ЕИС ЖКХ', 'success');
      setTimeout(() => {
        setIsModalOpen(false);
        navigate('/tickets');
      }, 500);
    },
    onError: () => {
      showToast('Не удалось отправить обращение. Попробуйте снова.', 'error');
      setIsConfirmed(false);
      setSliderPos(0);
    },
  });

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
    if (isConfirmed || createTicketMutation.isPending) return;
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
      createTicketMutation.mutate();
    }
  };

  const handleTouchEnd = () => {
    if (isConfirmed) return;
    setIsDragging(false);
    setSliderPos(0);
  };

  const openConfirmation = () => {
    if (!description.trim()) {
      showToast('Пожалуйста, опишите проблему', 'error');
      return;
    }
    impact('medium');
    setIsConfirmed(false);
    setSliderPos(0);
    setIsModalOpen(true);
  };

  const address = profile?.house_address || 'ул. Баумана, д. 12';
  const apt = profile?.apartment_number ? `кв. ${profile.apartment_number}` : 'кв. 48';

  return (
    <div className="bg-[#f7f9ff] text-slate-900 min-h-screen flex flex-col relative select-none">
      <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 pt-safe">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Назад"
              onClick={() => navigate(-1)}
              className="w-11 h-11 flex items-center justify-center rounded-full text-slate-800 hover:bg-slate-100 active:scale-95 cursor-pointer"
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
                {address}, {apt}
              </p>
            </div>
          </div>
          <span className="text-[12px] text-primary font-semibold shrink-0">Собственник</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-slate-800">
            Категория проблемы ЖКХ
          </label>
          <select
            value={topicCode}
            onChange={(e) => {
              setTopicCode(e.target.value);
              const found = topics.find((t) => t.code === e.target.value);
              if (found) setTopic(found.title);
            }}
            className="w-full min-h-[48px] p-3 rounded-xl border border-slate-200 bg-white text-[13px] font-medium text-slate-900 shadow-xs focus:outline-none focus:border-primary"
          >
            {topics.length > 0 ? (
              topics.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.code} {t.title}
                </option>
              ))
            ) : (
              <>
                <option value="2.16">2.16 Прорыв трубы / стояка отопления или ГВС</option>
                <option value="1.04">1.04 Неисправность пассажирского лифта</option>
                <option value="3.02">3.02 Некачественная уборка подъезда</option>
                <option value="4.01">4.01 Отсутствие освещения на территории</option>
              </>
            )}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-slate-800">
            Описание проблемы
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Подробно опишите, что произошло, укажите подъезд, этаж или ориентир..."
            className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary transition-all resize-none shadow-xs"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-bold text-slate-800">
              Адресаты обращения
            </label>
            <span className="text-[11px] text-slate-400">
              Выбрано: {selectedCount}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {recipients.map((r) => (
              <div
                key={r.id}
                onClick={() => toggleRecipient(r.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                  r.checked
                    ? 'bg-sky-50/70 border-primary shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      r.checked ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[19px]">
                      {r.icon}
                    </span>
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-[13px] font-bold text-slate-900 truncate">
                      {r.name}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate">
                      {r.role}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all ${
                    r.checked
                      ? 'bg-primary border-primary text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {r.checked && (
                    <span className="material-symbols-outlined text-[16px] leading-none">
                      check
                    </span>
                  )}
                </div>
              </div>
            ))}
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
                Обезличенно, чтобы соседи могли присоединиться кнопкой «У меня тоже»
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
                Подтверждение отправки
              </h2>
              <p className="text-[12px] text-slate-500 max-w-sm">
                Обращение будет официально зарегистрировано в реестре дома и направлено в УК.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 flex flex-col gap-2 border border-slate-100 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Адресаты</span>
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
                <span className="text-slate-400">В ленту</span>
                <span className="font-semibold text-slate-900">
                  {publishInFeed ? 'Да (публично)' : 'Нет (приватно)'}
                </span>
              </div>
            </div>

            {!isConfirmed ? (
              <div className="flex flex-col gap-2 pt-1">
                <div
                  ref={sliderContainerRef}
                  onMouseMove={(e) => handleTouchMove(e.clientX)}
                  onMouseUp={handleTouchEnd}
                  onMouseLeave={handleTouchEnd}
                  onTouchMove={(e) => handleTouchMove(e.touches[0].clientX)}
                  onTouchEnd={handleTouchEnd}
                  className="relative w-full h-14 rounded-full bg-slate-100 border border-slate-200 p-1 flex items-center select-none overflow-hidden"
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-primary/10 rounded-full"
                    style={{ width: `${sliderPos + 48}px` }}
                  />
                  <span
                    className={`w-full text-center text-[13px] font-semibold text-slate-500 tracking-wide transition-opacity ${
                      isDragging ? 'opacity-30' : 'opacity-100'
                    }`}
                  >
                    {createTicketMutation.isPending
                      ? 'Регистрация обращения...'
                      : 'Проведите для отправки'}
                  </span>
                  <div
                    onMouseDown={(e) => handleTouchStart(e.clientX)}
                    onTouchStart={(e) => handleTouchStart(e.touches[0].clientX)}
                    style={{ transform: `translateX(${sliderPos}px)` }}
                    className="absolute left-1 top-1 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center cursor-grab active:cursor-grabbing shadow-md active:scale-95 transition-transform duration-75"
                  >
                    <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2.5 text-center text-[13px] font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Отмена
                </button>
              </div>
            ) : (
              <div className="w-full h-14 rounded-full bg-emerald-600 text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                <span className="material-symbols-outlined text-[20px]">check</span>
                <span>Обращение успешно отправлено!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
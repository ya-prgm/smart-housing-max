import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTicketDetails } from '../hooks/useTickets';
import { useHaptic } from '../../../../shared/hooks/useHaptic';
import { useToast } from '../../../../shared/hooks/useToast';
import { useProfile } from '../../profile/hooks/useProfile';
import { ConfirmSlider } from '../components/ConfirmSlider';

export const TicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ticketId = id || '1';
  const { profile } = useProfile();
  const { ticket, isLoading, isError, toggleSupport, deleteTicket } = useTicketDetails(ticketId);
  const { impact, notification } = useHaptic();
  const { showToast } = useToast();

  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [isSupportSuccessModalOpen, setIsSupportSuccessModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  const handleSupportClick = async () => {
    if (!ticket || ticket.is_my) return;
    impact('light');
    try {
      const res = await toggleSupport();
      if (res && res.is_supported_by_me) {
        notification('success');
        setIsSupportSuccessModalOpen(true);
      } else {
        impact('medium');
      }
    } catch {
      showToast('Ошибка при поддержке обращения', 'error');
    }
  };

  const handleRevokeConfirm = async () => {
    if (isRevoking) return;
    setIsRevoking(true);
    try {
      await deleteTicket();
      notification('success');
      showToast('Обращение успешно отозвано', 'success');
      setTimeout(() => {
        setIsRevokeModalOpen(false);
        navigate('/tickets');
      }, 400);
    } catch {
      showToast('Не удалось отозвать обращение', 'error');
      setIsRevoking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center">
        <div className="w-full max-w-[430px] min-h-screen bg-surface flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center">
        <div className="w-full max-w-[430px] min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-lg font-bold text-on-surface mb-2">Обращение не найдено</h2>
          <button
            type="button"
            onClick={() => navigate('/tickets')}
            className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold cursor-pointer"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  const formattedCode = ticket.code.startsWith('#') ? ticket.code : `#${ticket.code}`;
  const firstPhoto = ticket.attachments?.find(
    (att) => att.mime_type.startsWith('image/') || /\.(jpe?g|png|webp|gif)$/i.test(att.filename)
  );

  const formattedDate = new Date(ticket.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  const aptLabel = profile?.apartment_number ? `Квартира ${profile.apartment_number}` : 'Квартира 48';
  const roleLabel = profile?.role === 'chairman' ? 'Председатель' : 'Собственник';

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center selection:bg-primary/20">
      <div className="w-full max-w-[430px] min-h-screen bg-surface font-body-md text-body-md text-on-surface flex flex-col relative shadow-2xl overflow-x-hidden">
        <header className="sticky top-0 max-w-[430px] w-full z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all">
          <div className="px-4 pt-2.5 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Назад"
                onClick={() => navigate(-1)}
                className="w-9 h-9 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </button>
              <h1 className="font-bold text-[17px] text-slate-900 tracking-tight truncate">
                Обращение {formattedCode}
              </h1>
            </div>
            <div className="flex items-center justify-end w-9 h-9" />
          </div>
        </header>

        <main className="flex flex-col relative w-full pb-safe bg-surface min-h-screen">
          {ticket.is_my ? (
            <div className="flex flex-col w-full px-margin pb-28 space-y-3 pt-2">
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-space-md min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[22px]">apartment</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-label-lg text-label-lg text-on-surface truncate">
                      {ticket.house_address || profile?.house_address || 'ЖК «Северное Сияние»'}
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {aptLabel} • {roleLabel}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ml-2 ${
                    ticket.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : ticket.status === 'in_progress'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-cyan-50 text-cyan-700'
                  }`}
                >
                  {ticket.status === 'completed'
                    ? 'Выполнено'
                    : ticket.status === 'in_progress'
                    ? 'В работе'
                    : 'Активно'}
                </span>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3">
                <div className="space-y-1">
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    {ticket.title}
                  </h2>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">
                  {ticket.description}
                </p>

                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div className="space-y-space-xs pt-space-xs">
                    <div className="text-label-sm text-on-surface-variant font-medium">
                      Прикрепленные материалы ({ticket.attachments.length})
                    </div>
                    <div className="grid grid-cols-2 gap-space-sm">
                      {ticket.attachments.map((att) => {
                        const isImg =
                          att.mime_type.startsWith('image/') ||
                          /\.(jpe?g|png|webp|gif)$/i.test(att.filename);

                        return isImg ? (
                          <button
                            key={att.id}
                            type="button"
                            onClick={() => setActivePhoto(att.url)}
                            className="relative group bg-surface-container-high rounded-lg overflow-hidden flex flex-col text-left transition-all active:scale-[0.98] cursor-pointer"
                          >
                            <div className="relative w-full h-24 bg-surface-variant overflow-hidden">
                              <img
                                src={att.url}
                                alt={att.filename}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white font-medium flex items-center gap-0.5 backdrop-blur-sm">
                                <span className="material-symbols-outlined text-[12px]">zoom_in</span> Фото
                              </span>
                            </div>
                            <div className="p-2 min-w-0">
                              <div className="text-label-sm text-on-surface font-medium truncate">
                                {att.filename}
                              </div>
                              <div className="text-[11px] text-outline">
                                {Math.round(att.size / 1024)} КБ • JPEG
                              </div>
                            </div>
                          </button>
                        ) : (
                          <a
                            key={att.id}
                            href={att.url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-surface-container-high rounded-lg p-2.5 flex flex-col justify-between active:scale-[0.98] transition-all cursor-pointer"
                          >
                            <div className="flex items-start justify-between">
                              <div className="w-8 h-8 rounded-md bg-error-container text-on-error-container flex items-center justify-center">
                                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                              </div>
                              <span className="material-symbols-outlined text-outline text-[18px]">download</span>
                            </div>
                            <div className="min-w-0 pt-2">
                              <div className="text-label-sm text-on-surface font-medium truncate">
                                {att.filename}
                              </div>
                              <div className="text-[11px] text-outline">
                                {Math.round(att.size / 1024)} КБ • Документ
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {ticket.recipients && ticket.recipients.length > 0 && (
                <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-label-lg text-label-lg text-on-surface">Назначенные службы</span>
                    <span className="text-label-sm text-outline">{ticket.recipients.length} адресата</span>
                  </div>
                  <div className="space-y-space-sm">
                    {ticket.recipients.map((r, idx) => (
                      <div
                        key={r.id}
                        className="flex items-start gap-space-md p-space-sm rounded-lg bg-surface-container/40"
                      >
                        <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[20px]">
                            {r.icon || (idx === 0 ? 'corporate_fare' : 'water_drop')}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-label-md text-label-md text-on-surface flex items-center gap-1.5 flex-wrap">
                            <span className="truncate">{r.short_name}</span>
                            {idx === 0 && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-medium">
                                Основной
                              </span>
                            )}
                          </div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant pt-0.5">
                            {r.full_name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col w-full px-margin pb-8 space-y-4 pt-2">
              <div className="bg-surface-container-low rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 via-primary-container/30 to-secondary/20 flex items-center justify-center text-primary font-bold text-sm shadow-inner">
                    <span className="material-symbols-outlined text-[22px]">person</span>
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-surface" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-on-surface">
                      {ticket.author_full_name || 'Сосед'}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-outline">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    ticket.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : ticket.status === 'in_progress'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-cyan-50 text-cyan-700'
                  }`}
                >
                  {ticket.status === 'completed'
                    ? 'Выполнено'
                    : ticket.status === 'in_progress'
                    ? 'В работе'
                    : 'Активно'}
                </span>
              </div>

              <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm space-y-4">
                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-on-surface leading-snug">
                    {ticket.title}
                  </h2>
                  <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                    {ticket.description}
                  </p>
                </div>

                {firstPhoto && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-outline px-1">
                      <span>Прикрепленное фото ({ticket.attachments.length})</span>
                    </div>
                    <div
                      className="relative w-full h-52 rounded-2xl overflow-hidden cursor-pointer group shadow-inner"
                      onClick={() => setActivePhoto(firstPhoto.url)}
                    >
                      <img
                        alt="Фото проблемы"
                        src={firstPhoto.url}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3.5">
                        <div className="flex items-center gap-2 text-white text-xs">
                          <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                          <span className="font-medium">{firstPhoto.filename}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-primary/10 via-primary-container/20 to-surface-container rounded-3xl p-5 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">groups</span>
                    </div>
                    <span className="text-sm font-bold text-on-surface">Солидарность жильцов</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary text-on-primary" id="counter-badge">
                    {ticket.votes_count} {ticket.votes_count === 1 ? 'сосед' : 'соседей'}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-normal">
                  Чем больше жителей подтверждают актуальность неисправности, тем выше приоритет выезда службы ЖКХ.
                </p>

                <button
                  type="button"
                  id="support-toggle-btn"
                  onClick={handleSupportClick}
                  className={`w-full py-3.5 px-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2.5 shadow-md active:scale-[0.98] transition-all cursor-pointer ${
                    ticket.is_voted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-primary text-on-primary shadow-primary/25'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]" id="support-icon">
                    {ticket.is_voted ? 'check_circle' : 'how_to_reg'}
                  </span>
                  <span id="support-text">
                    {ticket.is_voted ? 'Вы поддержали проблему' : 'У меня такая же проблема'}
                  </span>
                  {!ticket.is_voted && (
                    <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center font-bold ml-1">
                      +1
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {ticket.is_my && (
            <div className="fixed bottom-0 max-w-[430px] w-full p-space-md bg-surface/90 backdrop-blur-xl shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-40 pb-safe">
              <div className="flex items-center gap-space-sm">
                <button
                  type="button"
                  id="btn-edit"
                  onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
                  className="flex-1 h-12 rounded-xl bg-primary text-on-primary font-label-lg flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                  <span>Редактировать</span>
                </button>
                <button
                  type="button"
                  id="btn-revoke"
                  aria-label="Отозвать обращение"
                  onClick={() => setIsRevokeModalOpen(true)}
                  className="h-12 px-4 rounded-xl bg-error-container/60 text-error font-label-lg flex items-center justify-center gap-1.5 active:scale-98 transition-transform cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                  <span>Отозвать</span>
                </button>
              </div>
            </div>
          )}
        </main>

        {isSupportSuccessModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 transition-opacity"
            id="support-modal"
          >
            <div className="bg-surface-container-lowest rounded-3xl w-full max-w-[390px] mx-auto p-6 space-y-5 text-center shadow-2xl transform transition-transform animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-[34px]">volunteer_activism</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-on-surface">Спасибо за солидарность!</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Ваш голос добавлен. Обращение поднято в топ приоритетов аварийной службы управляющей компании.
                </p>
              </div>
              <div className="bg-surface-container-low rounded-2xl p-3 text-left flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
                <span className="text-xs text-on-surface">Мы пришлем вам уведомление, когда заявка будет закрыта</span>
              </div>
              <button
                type="button"
                className="w-full py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm shadow-md active:scale-95 transition-transform cursor-pointer"
                onClick={() => setIsSupportSuccessModalOpen(false)}
              >
                Отлично, понятно
              </button>
            </div>
          </div>
        )}

        {activePhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-between p-4 backdrop-blur-sm"
            id="photo-modal"
            onClick={() => setActivePhoto(null)}
          >
            <div className="flex items-center justify-between text-white pt-safe">
              <span className="text-xs font-medium">Фотография обращения</span>
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white cursor-pointer"
                onClick={() => setActivePhoto(null)}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="flex items-center justify-center flex-1 my-auto">
              <img
                src={activePhoto}
                alt="Полноэкранное фото"
                className="max-w-full max-h-[75vh] object-contain rounded-xl"
              />
            </div>
            <div className="text-center text-white/70 text-xs pb-safe">
              Нажмите в любом месте, чтобы закрыть
            </div>
          </div>
        )}

        {isRevokeModalOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="absolute inset-0" onClick={() => !isRevoking && setIsRevokeModalOpen(false)} />

            <div className="relative z-20 w-full max-w-[430px] mx-auto bg-surface-container-lowest rounded-t-[28px] shadow-2xl px-margin pt-3 pb-8 flex flex-col items-center">
              <div className="w-10 h-1 bg-outline-variant/60 rounded-full mb-4" />

              <div className="w-16 h-16 rounded-full bg-error-container/70 flex items-center justify-center mb-3 text-error shadow-sm ring-4 ring-error-container/30">
                <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  delete_sweep
                </span>
              </div>

              <h2 className="font-headline-md text-headline-md text-on-surface text-center mb-1 font-bold tracking-tight">
                Отозвать и удалить обращение?
              </h2>
              <p className="text-body-sm text-center text-on-surface-variant max-w-[340px] mb-3 leading-snug">
                Заявка <span className="font-semibold text-on-surface">{formattedCode}</span> будет снята с диспетчерского контроля управляющей организации и удалена из публичной ленты дома. Это действие нельзя отменить.
              </p>

              <div className="w-full bg-surface-container-low rounded-xl p-3.5 flex flex-col gap-2 mb-4">
                <div className="flex items-center justify-between text-label-md">
                  <div className="flex items-center gap-1 font-bold text-primary">
                    <span className="material-symbols-outlined text-[16px]">tag</span>
                    <span>Обращение {formattedCode}</span>
                  </div>
                  <span className="text-[12px] text-on-surface-variant font-normal">
                    {ticket.house_address}
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-body-sm text-on-surface">
                  <span className="text-primary font-bold">•</span>
                  <span className="font-medium truncate">«{ticket.title}»</span>
                </div>
              </div>

              {!isRevoking ? (
                <ConfirmSlider
                  onSuccess={handleRevokeConfirm}
                  isDestructive={true}
                  label="Доведите жильца до дома"
                  lockLabel="Защита от случайной отправки"
                />
              ) : (
                <div className="w-full bg-error-container/50 rounded-2xl p-space-md flex flex-col items-center text-center animate-fade-in">
                  <span className="material-symbols-outlined text-[24px] text-error animate-spin mb-1">
                    progress_activity
                  </span>
                  <p className="font-label-lg text-label-lg text-error">Отзыв заявки...</p>
                </div>
              )}

              <button
                type="button"
                disabled={isRevoking}
                onClick={() => setIsRevokeModalOpen(false)}
                className="w-full h-11 rounded-xl bg-transparent hover:bg-surface-variant/40 text-on-surface-variant font-label-lg transition-colors flex items-center justify-center mt-2 cursor-pointer"
              >
                Отмена / Оставить обращение
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

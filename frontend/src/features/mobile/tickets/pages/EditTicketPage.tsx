import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useHaptic } from '../../../../shared/hooks/useHaptic';
import { useProfile } from '../../profile/hooks/useProfile';
import { useToast } from '../../../../shared/hooks/useToast';
import { ticketsApi, TopicItem, TicketResponseItem } from '../api';
import { ClassifierInput } from '../components/ClassifierInput';
import { RecipientSelector, RecipientOption } from '../components/RecipientSelector';
import { ConfirmSlider } from '../components/ConfirmSlider';

interface UploadedFileItem {
  id: number;
  url: string;
  name: string;
  sizeFormatted: string;
  isImage: boolean;
}

export const EditTicketPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { impact, notification } = useHaptic();
  const { profile } = useProfile();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [ticket, setTicket] = useState<TicketResponseItem | null>(null);

  const [topicCode, setTopicCode] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [publishInFeed, setPublishInFeed] = useState(true);
  const [recipients, setRecipients] = useState<RecipientOption[]>([]);
  const [attachments, setAttachments] = useState<UploadedFileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    const fetchTicket = async () => {
      try {
        const data = await ticketsApi.getTicketById(id);
        setTicket(data);
        setTopicCode(data.topic_code || '');
        setTopic(data.title || data.topic_title || '');
        setDescription(data.description || '');
        if (data.recipients && data.recipients.length > 0) {
          setRecipients(
            data.recipients.map((r) => ({
              id: String(r.id),
              code: r.code,
              name: r.short_name,
              role: r.full_name,
              icon: r.icon || 'corporate_fare',
              checked: true,
            }))
          );
        }
        if (data.attachments && data.attachments.length > 0) {
          setAttachments(
            data.attachments.map((att) => ({
              id: att.id,
              url: att.url,
              name: att.filename,
              sizeFormatted: `${Math.round(att.size / 1024)} КБ`,
              isImage:
                att.mime_type.startsWith('image/') ||
                /\.(jpe?g|png|webp|gif)$/i.test(att.filename),
            }))
          );
        }
      } catch {
        showToast('Не удалось загрузить обращение для редактирования', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTicket();
  }, [id, showToast]);

  const handleSelectTopic = (selected: TopicItem) => {
    setTopicCode(selected.code);
    setTopic(selected.title);
  };

  const handleClearTopic = () => {
    setTopicCode('');
    setTopic('');
  };

  const toggleRecipient = (recipientId: string) => {
    impact('light');
    setRecipients((prev) =>
      prev.map((r) => (r.id === recipientId ? { ...r, checked: !r.checked } : r))
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (attachments.length + files.length > 5) {
      showToast('Можно прикрепить не более 5 файлов', 'error');
      return;
    }

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await ticketsApi.uploadFile(file);
        const isImg = file.type.startsWith('image/');
        const sizeFormatted =
          file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} МБ`
            : `${Math.round(file.size / 1024)} КБ`;

        setAttachments((prev) => [
          ...prev,
          {
            id: res.id,
            url: res.url,
            name: res.filename,
            sizeFormatted,
            isImage: isImg,
          },
        ]);
      }
      impact('light');
    } catch {
      showToast('Ошибка при загрузке файла', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeAttachment = (fileId: number) => {
    impact('light');
    setAttachments((prev) => prev.filter((a) => a.id !== fileId));
  };

  const handleOpenConfirmModal = () => {
    if (!description.trim()) {
      showToast('Пожалуйста, введите подробное описание проблемы', 'error');
      return;
    }
    impact('medium');
    setIsModalOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!ticket || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await ticketsApi.updateTicket(ticket.id, {
        title: topic.trim() || ticket.title,
        description: description.trim(),
      });
      await queryClient.invalidateQueries({ queryKey: ['ticket', String(ticket.id)] });
      await queryClient.invalidateQueries({ queryKey: ['tickets'] });
      notification('success');
      showToast('Изменения успешно сохранены', 'success');
      setTimeout(() => {
        setIsModalOpen(false);
        navigate(`/tickets/${ticket.id}`);
      }, 350);
    } catch {
      showToast('Не удалось сохранить изменения', 'error');
      setIsSubmitting(false);
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

  if (!ticket) {
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

  const address = ticket.house_address || profile?.house_address || 'ЖК «Северное Сияние»';
  const apt = profile?.apartment_number ? `кв. ${profile.apartment_number}` : 'кв. 48';
  const roleName = profile?.role === 'chairman' ? 'Председатель' : 'Собственник';
  const checkedRecipients = recipients.filter((r) => r.checked);
  const selectedRecipientNames =
    checkedRecipients.length > 0
      ? checkedRecipients.map((r) => r.name).join(', ')
      : 'ООО «ЖилКомфорт»';

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center selection:bg-primary/20">
      <div className="w-full max-w-[430px] min-h-screen bg-surface font-body-md text-body-md text-on-surface flex flex-col relative shadow-2xl overflow-x-hidden">
        <header className="fixed top-0 max-w-[430px] w-full z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
          <div className="h-14 px-margin flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <button
                type="button"
                aria-label="Назад"
                onClick={() => navigate(-1)}
                className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-variant/40 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </button>
              <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight truncate">
                Редактирование обращения {ticket.code.startsWith('#') ? ticket.code : `#${ticket.code}`}
              </h1>
            </div>
            <div className="flex items-center justify-end w-11 h-11" />
          </div>
        </header>

        <main className="flex flex-col relative w-full pt-14 pb-safe bg-surface min-h-screen">
          <div className="flex flex-col w-full pb-8">
            <div className="px-margin flex flex-col gap-space-lg pt-space-md">
              <div className="flex items-center justify-between bg-surface-container-low px-space-md py-space-sm rounded-xl">
                <div className="flex items-center gap-space-sm min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">apartment</span>
                  </div>
                  <div className="truncate">
                    <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                      Объект обращения
                    </p>
                    <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                      {address}, {apt}
                    </p>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-primary font-medium shrink-0">
                  {roleName}
                </span>
              </div>

              <ClassifierInput
                value={topic}
                selectedCode={topicCode}
                onSelect={handleSelectTopic}
                onClear={handleClearTopic}
              />

              <RecipientSelector
                recipients={recipients}
                topicTitle={topic}
                onToggle={toggleRecipient}
                isLoading={false}
              />

              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">
                      3
                    </span>
                    <label className="font-label-lg text-label-lg text-on-surface font-semibold" htmlFor="desc-input">
                      Подробное описание обращения
                    </label>
                  </div>
                  <span className="font-label-sm text-label-sm text-outline" id="char-counter">
                    {description.length} / 1000
                  </span>
                </div>
                <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-space-md focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <textarea
                    id="desc-input"
                    rows={4}
                    maxLength={1000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-transparent font-body-md text-body-md text-on-surface outline-none resize-none placeholder:text-outline leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">
                      4
                    </span>
                    <label className="font-label-lg text-label-lg text-on-surface font-semibold">
                      Фото или документы
                    </label>
                  </div>
                  <span className="font-label-sm text-label-sm text-outline">
                    {attachments.length} из 5 файлов
                  </span>
                </div>

                {attachments.length > 0 && (
                  <div className="grid grid-cols-2 gap-space-sm">
                    {attachments.map((file) =>
                      file.isImage ? (
                        <div
                          key={file.id}
                          className="relative group h-28 rounded-2xl overflow-hidden bg-surface-container shadow-sm flex flex-col justify-end"
                        >
                          <img
                            src={file.url}
                            alt={file.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent" />
                          <button
                            type="button"
                            aria-label="Удалить фото"
                            onClick={() => removeAttachment(file.id)}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center text-on-surface shadow-xs active:scale-95 transition-transform cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                          <div className="relative p-2 z-10">
                            <p className="font-label-sm text-label-sm text-inverse-on-surface truncate">
                              {file.name}
                            </p>
                            <p className="text-[10px] text-inverse-on-surface/75">{file.sizeFormatted}</p>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={file.id}
                          className="relative h-28 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm p-space-sm flex flex-col justify-between"
                        >
                          <button
                            type="button"
                            aria-label="Удалить файл"
                            onClick={() => removeAttachment(file.id)}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                          <div className="w-9 h-9 rounded-xl bg-error-container text-on-error-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                          </div>
                          <div>
                            <p className="font-label-md text-label-md text-on-surface font-medium truncate">
                              {file.name}
                            </p>
                            <p className="font-label-sm text-label-sm text-outline">{file.sizeFormatted}</p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*,application/pdf"
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={isUploading || attachments.length >= 5}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-12 rounded-2xl bg-surface-container-lowest border border-dashed border-primary/40 shadow-xs flex items-center justify-center gap-2 text-primary font-label-lg text-label-lg active:bg-surface-container-low transition-colors cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {isUploading ? 'progress_activity' : 'add_photo_alternate'}
                  </span>
                  <span>{isUploading ? 'Загрузка...' : '+ Добавить фото или файл'}</span>
                </button>
              </div>

              <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex items-center justify-between gap-space-md">
                <div className="flex items-start gap-space-sm">
                  <div className="w-9 h-9 rounded-full bg-primary-fixed/60 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">public</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                      Опубликовать в ленте дома
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Обезличенно, чтобы соседи с аналогичной проблемой могли присоединиться
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={publishInFeed}
                    onChange={(e) => setPublishInFeed(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-7 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex flex-col gap-2 pt-space-xs">
                <button
                  type="button"
                  onClick={handleOpenConfirmModal}
                  className="w-full h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 active:scale-[0.98] transition-all font-label-lg text-label-lg font-semibold tracking-wide cursor-pointer"
                >
                  <span>Редактировать обращение</span>
                  <span className="material-symbols-outlined text-[22px]">edit</span>
                </button>
                <p className="text-center font-label-sm text-label-sm text-outline px-2 leading-tight">
                  Нажимая «Редактировать обращение», вы подтверждаете регламентную регистрацию в Единой системе ЖКХ с фиксацией срока ответа
                </p>
              </div>
            </div>
          </div>
        </main>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="absolute inset-0" onClick={() => !isSubmitting && setIsModalOpen(false)} />

            <div className="relative z-20 w-full max-w-[430px] mx-auto bg-surface-container-lowest rounded-t-[28px] shadow-2xl px-5 pt-3 pb-6 flex flex-col max-h-[92vh] overflow-y-auto">
              <div className="w-12 h-1.5 bg-outline-variant/60 rounded-full mx-auto mb-4 shrink-0" />

              <div className="flex justify-center mb-3">
                <div className="relative w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined text-[32px]">edit_note</span>
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shadow">
                    <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check
                    </span>
                  </span>
                </div>
              </div>

              <div className="text-center px-2 mb-4">
                <h2 className="text-headline-md font-bold text-on-surface tracking-tight leading-snug mb-1.5">
                  Сохранить изменения в обращении?
                </h2>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  Обновленные данные будут повторно переданы в диспетчерскую службу управляющей организации и обновлены в ленте дома.
                </p>
              </div>

              <div className="bg-surface-container-low rounded-2xl p-3.5 space-y-2.5 mb-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-body-sm text-on-surface-variant flex items-center gap-1.5 shrink-0">
                    <span className="material-symbols-outlined text-[17px] text-primary">apartment</span>
                    Адресат:
                  </span>
                  <span className="text-body-sm font-semibold text-on-surface text-right truncate">
                    {selectedRecipientNames}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-body-sm text-on-surface-variant flex items-center gap-1.5 shrink-0">
                    <span className="material-symbols-outlined text-[17px] text-primary">subject</span>
                    Тема:
                  </span>
                  <span className="text-body-sm font-semibold text-on-surface text-right truncate max-w-[210px]">
                    «{topic || ticket.title}»
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-body-sm text-on-surface-variant flex items-center gap-1.5 shrink-0">
                    <span className="material-symbols-outlined text-[17px] text-primary">attach_file</span>
                    Файлы:
                  </span>
                  <span className="text-body-sm font-semibold text-on-surface text-right">
                    {attachments.length > 0 ? `${attachments.length} прикрепленных файла` : 'Без файлов'}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-outline-variant/30">
                  <span className="text-body-sm text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[17px] text-primary">history</span>
                    Статус:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-semibold">
                    Сохранение версии v2
                  </span>
                </div>
              </div>

              {!isSubmitting ? (
                <ConfirmSlider
                  onSuccess={handleConfirmSave}
                  label="Доведите жильца до дома"
                  lockLabel="Защита от случайной отправки"
                />
              ) : (
                <div className="w-full bg-surface-container-high rounded-2xl p-space-md flex flex-col items-center text-center animate-fade-in">
                  <span className="material-symbols-outlined text-[24px] text-primary animate-spin mb-1">
                    progress_activity
                  </span>
                  <p className="font-label-lg text-label-lg text-primary font-semibold">Сохранение изменений...</p>
                </div>
              )}

              <button
                type="button"
                id="closeModalBtn"
                disabled={isSubmitting}
                onClick={() => setIsModalOpen(false)}
                className="w-full h-11 rounded-xl bg-transparent hover:bg-surface-variant/40 text-on-surface-variant font-label-lg transition-colors flex items-center justify-center mt-2 cursor-pointer"
              >
                Отмена / Закрыть
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

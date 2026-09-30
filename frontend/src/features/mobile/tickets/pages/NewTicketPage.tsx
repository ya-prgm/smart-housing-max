import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useHaptic } from '../../../../shared/hooks/useHaptic';
import { useProfile } from '../../profile/hooks/useProfile';
import { useToast } from '../../../../shared/hooks/useToast';
import { ticketsApi, TopicItem } from '../api';
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

export const NewTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { impact, notification } = useHaptic();
  const { profile } = useProfile();
  const { showToast } = useToast();

  const [topicCode, setTopicCode] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [publishInFeed, setPublishInFeed] = useState(true);
  const [recipients, setRecipients] = useState<RecipientOption[]>([]);
  const [attachments, setAttachments] = useState<UploadedFileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: topicRecipients = [], isLoading: isLoadingRecipients } = useQuery({
    queryKey: ['topic-recipients', topicCode],
    queryFn: () => (topicCode ? ticketsApi.getTopicRecipients(topicCode) : Promise.resolve([])),
    enabled: !!topicCode,
  });

  useEffect(() => {
    if (topicRecipients.length > 0) {
      setRecipients(
        topicRecipients.map((r) => ({
          id: String(r.id),
          code: r.code,
          name: r.short_name,
          role: r.full_name,
          icon: r.icon || 'corporate_fare',
          checked: true,
        }))
      );
    } else if (topicCode) {
      setRecipients([]);
    }
  }, [topicRecipients, topicCode]);

  const handleSelectTopic = (selected: TopicItem) => {
    setTopicCode(selected.code);
    setTopic(selected.title);
  };

  const handleClearTopic = () => {
    setTopicCode('');
    setTopic('');
    setRecipients([]);
  };

  const toggleRecipient = (id: string) => {
    impact('light');
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, checked: !r.checked } : r))
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
            name: file.name,
            sizeFormatted,
            isImage: isImg,
          },
        ]);
      }
      showToast('Файл успешно загружен', 'success');
    } catch {
      showToast('Ошибка при загрузке файла', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeAttachment = (id: number) => {
    impact('light');
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const selectedRecipientNames = recipients
    .filter((r) => r.checked)
    .map((r) => r.name)
    .join(', ');

  const createTicketMutation = useMutation({
    mutationFn: () =>
      ticketsApi.createTicket({
        topic_code: topicCode,
        title: topic,
        description: description.trim(),
        recipient_codes: recipients.filter((r) => r.checked).map((r) => r.code),
        is_public_in_feed: publishInFeed,
        attachment_ids: attachments.map((a) => a.id),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      notification('success');
      showToast('Обращение успешно зарегистрировано в ЕИС ЖКХ', 'success');
      setTimeout(() => {
        setIsModalOpen(false);
        navigate('/tickets');
      }, 500);
    },
    onError: () => {
      showToast('Не удалось отправить обращение. Попробуйте снова.', 'error');
      setIsConfirmed(false);
    },
  });

  const handleSliderSuccess = () => {
    setIsConfirmed(true);
    createTicketMutation.mutate();
  };

  const openConfirmation = () => {
    if (!topic.trim()) {
      showToast('Пожалуйста, выберите тему обращения по классификатору', 'error');
      return;
    }
    const hasRecipient = recipients.some((r) => r.checked);
    if (!hasRecipient) {
      showToast('Пожалуйста, выберите хотя бы одного адресата', 'error');
      return;
    }
    if (!description.trim()) {
      showToast('Пожалуйста, введите подробное описание проблемы', 'error');
      return;
    }
    impact('medium');
    setIsConfirmed(false);
    setIsModalOpen(true);
  };

  const address = profile?.house_address || 'ЖК «Северное Сияние»';
  const apt = profile?.apartment_number ? `кв. ${profile.apartment_number}` : 'кв. 48';
  const roleName = profile?.role === 'chairman' ? 'Председатель' : 'Собственник';

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
                Новое обращение
              </h1>
            </div>
            <div className="flex items-center justify-end w-9 h-9" />
          </div>
        </header>

        <main className="flex flex-col relative w-full pb-safe bg-surface min-h-screen">
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
                isLoading={isLoadingRecipients}
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
                    placeholder="В ванной комнате капает стояк отопления на стыке труб, требуется срочный выезд аварийной бригады..."
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
                  onClick={openConfirmation}
                  className="w-full h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 active:scale-[0.98] transition-all font-label-lg text-label-lg font-semibold tracking-wide cursor-pointer"
                >
                  <span>Отправить обращение</span>
                  <span className="material-symbols-outlined text-[22px]">send</span>
                </button>
                <p className="text-center font-label-sm text-label-sm text-outline px-2 leading-tight">
                  Нажимая «Отправить обращение», вы подтверждаете регламентную регистрацию в Единой системе ЖКХ с фиксацией срока ответа
                </p>
              </div>
            </div>
          </div>
        </main>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="absolute inset-0" onClick={() => !createTicketMutation.isPending && setIsModalOpen(false)} />

            <div className="relative z-10 w-full bg-surface-container-lowest rounded-t-[28px] shadow-2xl p-space-md pt-3 pb-8 flex flex-col gap-space-md max-w-[430px] mx-auto transform transition-transform">
              <div className="w-12 h-1.5 bg-outline-variant/60 rounded-full mx-auto mb-1" />

              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-14 h-14 rounded-full bg-primary-fixed/50 flex items-center justify-center text-primary mb-1">
                  <span className="material-symbols-outlined text-[28px]">mark_email_read</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
                  Вы уверены, что хотите отправить обращение?
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
                  После подтверждения заявка будет немедленно зарегистрирована и направлена исполнителю, а также опубликована в ленте дома.
                </p>
              </div>

              <div className="bg-surface-container-low rounded-2xl p-space-md flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-outline font-label-md">Адресат</span>
                  <span className="font-label-md text-on-surface font-medium text-right max-w-[210px] truncate">
                    {selectedRecipientNames || 'ООО «ЖилКомфорт»'}
                  </span>
                </div>
                <div className="h-[1px] bg-outline-variant/30 w-full" />

                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-outline font-label-md">Тема</span>
                  <span className="font-label-md text-on-surface font-semibold text-right max-w-[200px] truncate">
                    «{topic}»
                  </span>
                </div>
                <div className="h-[1px] bg-outline-variant/30 w-full" />

                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-outline font-label-md">Прикреплено</span>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">attach_file</span>
                    <span className="font-label-md text-on-surface">
                      {attachments.length > 0 ? `${attachments.length} файла` : 'Без файлов'}
                    </span>
                  </div>
                </div>
                <div className="h-[1px] bg-outline-variant/30 w-full" />

                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-outline font-label-md">Статус</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm">
                    Будет присвоен «В обработке»
                  </span>
                </div>
              </div>

              {!isConfirmed ? (
                <ConfirmSlider
                  onSuccess={handleSliderSuccess}
                  label={createTicketMutation.isPending ? 'Регистрация...' : 'Доведите жильца до дома'}
                  lockLabel="Защита от случайной отправки"
                  disabled={createTicketMutation.isPending}
                />
              ) : (
                <div className="w-full bg-surface-container-high rounded-2xl p-space-md flex flex-col items-center text-center animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center mb-1">
                    <span className="material-symbols-outlined text-[22px]">check</span>
                  </div>
                  <p className="font-label-lg text-label-lg text-on-surface font-semibold">Заявка зарегистрирована!</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Переход к списку обращений...</p>
                </div>
              )}

              <button
                type="button"
                disabled={createTicketMutation.isPending}
                onClick={() => setIsModalOpen(false)}
                className="w-full h-11 rounded-xl bg-transparent hover:bg-surface-variant/40 text-on-surface-variant font-medium text-body-md transition-colors flex items-center justify-center cursor-pointer"
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
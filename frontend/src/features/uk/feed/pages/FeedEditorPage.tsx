import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ukApi } from '../../api';
import { useToast } from '../../../../shared/hooks/useToast';

export const FeedEditorPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('announcement');
  const [houseId, setHouseId] = useState(1);

  const createPostMutation = useMutation({
    mutationFn: () =>
      ukApi.createFeedPost({
        house_id: houseId,
        title: title.trim() || undefined,
        content,
        post_type: postType,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['uk-dashboard'] });
      showToast('Новость успешно опубликована в ленте дома', 'success');
      setTitle('');
      setContent('');
    },
    onError: () => {
      showToast('Ошибка при публикации новости', 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast('Введите текст публикации', 'error');
      return;
    }
    createPostMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Публикация в ленту дома
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Информирование жителей о плановых работах, отключениях и новостях ЖКХ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-slate-900 text-base">Создание записи</h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Целевой дом</label>
            <select
              value={houseId}
              onChange={(e) => setHouseId(Number(e.target.value))}
              className="h-10 px-3 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:outline-none focus:border-primary"
            >
              <option value={1}>ул. Баумана, д. 12</option>
              <option value={2}>ул. Флотская, д. 30</option>
              <option value={3}>ул. Чистопольская, д. 65</option>
              <option value={4}>ул. Декабристов, д. 85</option>
              <option value={5}>пр-т Победы, д. 139</option>
              <option value={6}>ул. Пушкина, д. 42</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Категория публикации</label>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className="h-10 px-3 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:outline-none focus:border-primary"
            >
              <option value="announcement">Плановое объявление</option>
              <option value="report">Отчет о выполненных работах</option>
              <option value="emergency">Аварийное оповещение</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Заголовок новости</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Плановая промывка и дезинфекция мусоропроводов"
              className="h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Текст сообщения</label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Подробный текст сообщения для жителей дома..."
              className="p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={createPostMutation.isPending}
            className="h-11 bg-primary text-white rounded-xl font-bold text-sm shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>{createPostMutation.isPending ? 'Публикация...' : 'Опубликовать для жителей'}</span>
          </button>
        </form>

        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-slate-900 text-base">Предпросмотр в мобильной ленте</h3>
          <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 flex justify-center">
            <div className="w-[360px] bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-sky-100 text-primary flex items-center justify-center text-xs font-bold">
                  УК
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">УК «ЖилКомФорт»</span>
                  <span className="text-[10px] text-slate-400">Только что • Официально</span>
                </div>
              </div>

              {title && <h4 className="text-sm font-bold text-slate-900 leading-snug">{title}</h4>}
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {content || 'Здесь будет отображаться текст вашей публикации так, как его увидят жители в мобильном приложении MAX.'}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">thumb_up</span> 0
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">chat</span> 0
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">visibility</span> 1
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

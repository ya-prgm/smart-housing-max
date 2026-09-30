import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../shared/api/client';
import { useToast } from '../../../shared/hooks/useToast';

export const ChairmanCreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      showToast('Введите текст поста', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      let imageIds: number[] = [];

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('context', 'feed');
        try {
          const { data } = await apiClient.post('/files/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          if (data?.id) imageIds = [data.id];
        } catch {}
      }

      await apiClient.post('/feed', {
        title: title.trim() || null,
        content: content.trim(),
        post_type: 'announcement',
        image_ids: imageIds,
        images: [],
        image_label: null,
      });

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/chairman/feed');
      }, 1500);
    } catch {
      showToast('Не удалось опубликовать пост', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[40px] text-emerald-600">check_circle</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Пост опубликован!</h2>
        <p className="text-sm text-slate-500">Жильцы дома увидят его в общей ленте</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen pb-12 bg-[#f8fafc] text-slate-900 select-none">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all">
        <div className="px-4 pt-2.5 pb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 cursor-pointer active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            <span className="text-[14px] font-semibold">Назад</span>
          </button>
          <span className="text-[15px] font-bold text-slate-900">Новая публикация</span>
          <div className="w-12" />
        </div>
      </header>

      <div className="px-4 pt-4 pb-6 flex flex-col gap-4 max-w-lg mx-auto w-full">
        <div className="bg-white rounded-3xl p-5 shadow-card border border-slate-200/80">
          <h1 className="text-lg font-bold text-slate-900 mb-1">Создание записи</h1>
          <p className="text-xs text-slate-500">Публикация появится в ленте дома для всех собственников</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-slate-700 px-1">
            Заголовок (необязательно)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: Плановые работы или объявление"
            maxLength={150}
            className="w-full h-11 px-4 bg-white rounded-2xl border border-slate-200/80 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary shadow-xs transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-slate-700 px-1">
            Текст поста <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Напишите сообщение для жильцов дома..."
            rows={5}
            className="w-full p-4 bg-white rounded-2xl border border-slate-200/80 text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:border-primary shadow-xs transition-colors leading-relaxed"
          />
          <div className="text-right text-[11px] text-slate-400">{content.length} символов</div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-bold text-slate-700 px-1">Фото (необязательно)</span>
          {imagePreview ? (
            <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200/80">
              <img src={imagePreview} alt="Превью" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full h-24 rounded-2xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center gap-1.5 text-slate-500 hover:border-primary hover:text-primary transition-colors cursor-pointer active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-[26px]">add_photo_alternate</span>
              <span className="text-[12px] font-semibold">Прикрепить фото</span>
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImagePick}
          />
        </div>

        {(title || content) && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-bold text-slate-700 px-1">Предварительный просмотр</span>
            <div className="bg-white rounded-3xl p-4 shadow-card border border-slate-200/80">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-primary font-bold text-xs">
                  П
                </div>
                <div>
                  <span className="text-[13px] font-bold text-slate-900">Председатель ТСЖ</span>
                  <div className="text-[10px] text-slate-400">Только что</div>
                </div>
              </div>
              {title && <p className="text-[15px] font-bold text-slate-900 mb-1">{title}</p>}
              <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-line line-clamp-3">
                {content}
              </p>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt=""
                  className="w-full h-32 object-cover rounded-2xl mt-2 border border-slate-100"
                />
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
          className="w-full h-12 rounded-full bg-primary hover:bg-[#00557a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-card active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer mt-2"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin">
                progress_activity
              </span>
              Публикуем...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">send</span>
              Опубликовать для жильцов
            </>
          )}
        </button>
      </div>
    </div>
  );
};

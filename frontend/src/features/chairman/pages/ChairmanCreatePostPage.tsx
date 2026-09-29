import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../shared/api/client';
import { useToast } from '../../../shared/hooks/useToast';

const POST_TYPES = [
  { id: 'announcement', label: 'Объявление', icon: 'campaign', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { id: 'info', label: 'Информация', icon: 'info', color: 'bg-slate-50 text-slate-600 border-slate-200' },
  { id: 'emergency', label: 'Авария / Срочно', icon: 'warning', color: 'bg-red-50 text-red-600 border-red-100' },
  { id: 'report', label: 'Отчёт', icon: 'receipt_long', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
];

export const ChairmanCreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('announcement');
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

      // Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('context', 'feed');
        try {
          const { data } = await apiClient.post('/files/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          if (data?.id) imageIds = [data.id];
        } catch {
          // Image upload optional - continue without it
        }
      }

      await apiClient.post('/feed', {
        title: title.trim() || null,
        content: content.trim(),
        post_type: postType,
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f4ff] px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4 animate-bounce">
          <span className="material-symbols-outlined text-[40px] text-emerald-600">check_circle</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Пост опубликован!</h2>
        <p className="text-sm text-slate-500">Жильцы дома увидят его в ленте</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen pb-10 bg-[#f0f4ff] text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 pt-safe bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-sm">
        <div className="h-14 px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 cursor-pointer active:opacity-70 transition-opacity"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            <span className="text-[15px] font-medium">Назад</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px] text-indigo-600">shield_person</span>
            </div>
            <span className="text-[13px] font-bold text-indigo-700">Председатель</span>
          </div>
        </div>
      </header>

      <div className="px-4 pt-5 pb-6 flex flex-col gap-5">
        {/* Title block */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h1 className="text-xl font-bold text-slate-900 mb-1">Новый пост</h1>
          <p className="text-sm text-slate-500">Публикация появится в ленте вашего дома</p>
        </div>

        {/* Post Type Selection */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[13px] font-semibold text-slate-600 px-1">Тип публикации</span>
          <div className="grid grid-cols-2 gap-2">
            {POST_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setPostType(type.id)}
                className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 transition-all cursor-pointer active:scale-[0.97] ${
                  postType === type.id
                    ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                    : 'border-transparent bg-white hover:border-slate-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${type.color}`}>
                  <span className="material-symbols-outlined text-[18px]">{type.icon}</span>
                </div>
                <span className={`text-[13px] font-semibold ${postType === type.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Title Input */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-slate-600 px-1">Заголовок (необязательно)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: Плановое отключение воды"
            maxLength={150}
            className="w-full h-12 px-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
          />
        </div>

        {/* Content Input */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-slate-600 px-1">
            Текст поста <span className="text-red-400">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Напишите сообщение для жильцов дома..."
            rows={6}
            className="w-full p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:border-indigo-400 transition-colors leading-relaxed"
          />
          <div className="text-right text-[11px] text-slate-400">{content.length} символов</div>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold text-slate-600 px-1">Фото (необязательно)</span>
          {imagePreview ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden group">
              <img src={imagePreview} alt="Превью" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { setImagePreview(null); setImageFile(null); }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full h-24 rounded-xl border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors cursor-pointer active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[28px]">add_photo_alternate</span>
              <span className="text-[12px] font-medium">Выбрать фото</span>
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

        {/* Preview */}
        {(title || content) && (
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-semibold text-slate-600 px-1">Превью публикации</span>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] text-indigo-600">shield_person</span>
                </div>
                <div>
                  <span className="text-[13px] font-bold text-slate-900">Председатель ТСЖ</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400">Только что</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className={`text-[10px] font-medium ${
                      postType === 'emergency' ? 'text-red-500' : 'text-slate-500'
                    }`}>
                      {POST_TYPES.find(t => t.id === postType)?.label}
                    </span>
                  </div>
                </div>
              </div>
              {title && <p className="text-[15px] font-bold text-slate-900 mb-1.5">{title}</p>}
              <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-line line-clamp-3">{content}</p>
              {imagePreview && (
                <img src={imagePreview} alt="" className="w-full h-32 object-cover rounded-xl mt-3" />
              )}
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
          className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer mt-2"
          style={{ boxShadow: '0 8px 24px rgba(79,70,229,0.3)' }}
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined text-[22px] animate-spin">progress_activity</span>
              Публикуем...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[22px]">send</span>
              Опубликовать для жильцов
            </>
          )}
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { ukApi } from '../../api';
import { useToast } from '../../../../shared/hooks/useToast';

interface NewsTemplate {
  name: string;
  category: 'announcement' | 'report' | 'emergency';
  title: string;
  content: string;
}

const TEMPLATES: NewsTemplate[] = [
  {
    name: 'Плановая опрессовка и промывка сетей',
    category: 'announcement',
    title: 'Плановая гидравлическая опрессовка и подготовка к отопительному сезону',
    content: 'Уважаемые жители!\n\nВ период с 15 по 18 октября управляющая компания совместно с ресурсоснабжающей организацией проводит плановые гидравлические испытания тепловых сетей дома.\n\nПросим обратить внимание на радиаторы отопления и при обнаружении подтеков незамедлительно обращаться в аварийно-диспетчерскую службу по круглосуточному номеру +7 (843) 236-00-00.',
  },
  {
    name: 'Отчет: замена светильников на LED',
    category: 'report',
    title: 'Отчет: завершена модернизация освещения в подъездах и входных группах',
    content: 'Управляющая компания отчитывается о выполненных работах:\n\nВо всех 4 подъездах дома произведена плановая замена устаревших люминесцентных ламп на энергоэффективные светодиодные светильники с оптико-акустическими датчиками движения.\n\nЭто позволит снизить общедомовой расход электроэнергии более чем на 35%. Гарантия на оборудование составляет 3 года.',
  },
  {
    name: 'Срочные аварийно-восстановительные работы',
    category: 'emergency',
    title: 'Аварийное перекрытие стояка ХВС в 1 подъезде',
    content: 'Внимание жителей 1 подъезда!\n\nВ связи с устранением локального свища на магистральном трубопроводе холодного водоснабжения временно приостановлена подача воды с 11:30 до 14:00.\n\nАварийная бригада уже работает на объекте. Приносим извинения за временные неудобства.',
  },
];

export const FeedEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const storedHouseId = Number(localStorage.getItem('selected_house_id')) || 1;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'announcement' | 'report' | 'emergency'>('announcement');
  const [houseId, setHouseId] = useState(storedHouseId);

  const { data: houses = [] } = useQuery({
    queryKey: ['uk-houses'],
    queryFn: ukApi.getHouses,
  });

  const selectedHouse = houses.find((h) => h.id === houseId) || houses[0];

  const createPostMutation = useMutation({
    mutationFn: () =>
      ukApi.createFeedPost({
        house_id: houseId,
        title: title.trim() || undefined,
        content: content.trim(),
        post_type: postType,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['uk-feed'] });
      queryClient.invalidateQueries({ queryKey: ['uk-dashboard'] });
      showToast('Новость успешно опубликована в ленте дома', 'success');
      setTitle('');
      setContent('');
      navigate('/uk/dashboard');
    },
    onError: () => {
      showToast('Ошибка при публикации новости', 'error');
    },
  });

  const applyTemplate = (tpl: NewsTemplate) => {
    setTitle(tpl.title);
    setContent(tpl.content);
    setPostType(tpl.category);
    showToast(`Применен шаблон «${tpl.name}»`, 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast('Введите текст публикации', 'error');
      return;
    }
    createPostMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Публикация в ленту МКД
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Официальные уведомления жителей, фотоотчеты ремонтов и аварийные оповещения
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/uk/dashboard')}
          className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer shadow-xs self-start sm:self-auto"
        >
          Вернуться в панель
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-slate-50 rounded-2xl p-5 border border-blue-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">Готовые шаблоны сообщений УК</span>
            <span className="text-[11px] text-blue-700 bg-white px-2 py-0.5 rounded-md font-semibold border border-blue-200">
              В 1 клик
            </span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">Выберите для быстрой вставки текста</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TEMPLATES.map((tpl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyTemplate(tpl)}
              className="p-3.5 rounded-xl bg-white hover:bg-blue-600 hover:text-white border border-slate-200 text-left transition-all group shadow-xs cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                  tpl.category === 'emergency' ? 'text-rose-600 group-hover:text-rose-100' : 'text-blue-600 group-hover:text-blue-100'
                }`}>
                  {tpl.category === 'emergency' ? 'Авария' : tpl.category === 'report' ? 'Отчет' : 'Объявление'}
                </span>
                <span className="text-xs font-bold text-slate-900 group-hover:text-white block line-clamp-2">
                  {tpl.name}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 group-hover:text-blue-200 mt-2 block font-medium">
                Применить →
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col gap-5">
          <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
            Параметры сообщения
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Целевой дом</label>
              <select
                value={houseId}
                onChange={(e) => setHouseId(Number(e.target.value))}
                className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {houses.map((house) => (
                  <option key={house.id} value={house.id}>{house.address}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Тип публикации</label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => setPostType('announcement')}
                  className={`h-10 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    postType === 'announcement'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Объявление
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('report')}
                  className={`h-10 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    postType === 'report'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Отчет
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('emergency')}
                  className={`h-10 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    postType === 'emergency'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Авария
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Заголовок публикации</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Плановая промывка и дезинфекция мусоропроводов"
              className="h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">
              Текст сообщения для жителей <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Опишите подробности, сроки работ, телефоны ответственных лиц..."
              className="p-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Отправка push-уведомления всем жителям МКД
            </span>

            <button
              type="submit"
              disabled={createPostMutation.isPending}
              className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>{createPostMutation.isPending ? 'Публикация...' : 'Опубликовать в приложении'}</span>
            </button>
          </div>
        </form>

        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Предпросмотр на смартфоне жителя</h3>
            <span className="text-xs text-slate-400 font-medium">MAX App Live View</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-[36px] shadow-2xl border-4 border-slate-800 max-w-[380px] mx-auto w-full">
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3" />

            <div className="bg-white rounded-[24px] p-4 flex flex-col gap-3 min-h-[420px] shadow-inner text-slate-900">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  УК
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 truncate">ООО УК «ЖилКомФорт»</span>
                    <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-bold">Официально</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {selectedHouse ? selectedHouse.address : 'МКД'} • Только что
                  </span>
                </div>
              </div>

              {postType === 'emergency' && (
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                  <span>СРОЧНОЕ АВАРИЙНОЕ ОПОВЕЩЕНИЕ</span>
                </div>
              )}

              {title && (
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {title}
                </h4>
              )}

              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line flex-1">
                {content || 'Здесь отображается текст вашего сообщения в реальном времени точно так же, как его увидят жители в мобильном приложении MAX.'}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 font-semibold text-slate-600">
                    <span>👍</span> 0
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-600">
                    <span>💬</span> 0
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">👁 1 просмотр</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

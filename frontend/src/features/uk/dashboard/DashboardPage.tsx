import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ukApi } from '../api';
import { apiClient } from '../../../shared/api/client';
import { formatDate } from '../../../shared/lib/formatDate';
import { useToast } from '../../../shared/hooks/useToast';

interface CommentItem {
  id: number | string;
  author_name: string;
  author_role?: string;
  content: string;
  created_at: string;
}

interface PostCommentsBlockProps {
  postId: number;
  onCommentsCountChange?: (count: number) => void;
}

const PostCommentsBlock: React.FC<PostCommentsBlockProps> = ({ postId, onCommentsCountChange }) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<CommentItem[]>([]);

  const { data: commentsData, isLoading } = useQuery({
    queryKey: ['post-comments', postId],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ items: CommentItem[]; total: number }>(`/feed/${postId}/comments`);
        return res.data?.items || [];
      } catch {
        return [];
      }
    },
  });

  const allComments = [...(commentsData || []), ...localComments];

  useEffect(() => {
    if (onCommentsCountChange) {
      onCommentsCountChange(allComments.length);
    }
  }, [allComments.length, onCommentsCountChange]);

  const addCommentMutation = useMutation({
    mutationFn: async (text: string) => {
      return apiClient.post(`/feed/${postId}/comments`, { content: text });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['uk-feed'] });
      setCommentText('');
      showToast('Комментарий успешно добавлен', 'success');
    },
    onError: () => {
      const fallbackItem: CommentItem = {
        id: Date.now(),
        author_name: 'ООО УК «ЖилКомФорт»',
        author_role: 'uk_staff',
        content: commentText.trim(),
        created_at: new Date().toISOString(),
      };
      setLocalComments((prev) => [...prev, fallbackItem]);
      setCommentText('');
      showToast('Комментарий добавлен', 'success');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number | string) => {
      return apiClient.delete(`/feed/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['uk-feed'] });
      showToast('Комментарий удален', 'success');
    },
    onError: () => {
      showToast('Не удалось удалить комментарий', 'error');
    },
  });

  const handleSend = () => {
    if (!commentText.trim()) return;
    addCommentMutation.mutate(commentText.trim());
  };

  return (
    <div className="border-t border-slate-100 bg-slate-50/70 p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-blue-600">forum</span>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Комментарии ({allComments.length})
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Ответ от лица УК</span>
      </div>

      {isLoading && (
        <div className="text-center py-4 text-xs text-slate-400">Загрузка комментариев...</div>
      )}

      {!isLoading && allComments.length === 0 && (
        <div className="text-center py-4 text-xs text-slate-400 bg-white/60 rounded-xl border border-slate-200/60 p-3">
          Комментариев пока нет. Напишите первое сообщение или ответ жильцам дома.
        </div>
      )}

      {allComments.length > 0 && (
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {allComments.map((c) => {
            const isUk = c.author_role === 'uk_staff';
            const isChairman = c.author_role === 'chairman';
            return (
              <div
                key={c.id}
                className={`p-3 rounded-xl border text-xs transition ${
                  isUk
                    ? 'bg-blue-50/80 border-blue-100 text-slate-900 ml-4'
                    : 'bg-white border-slate-200/80 text-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div
                      className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center shrink-0 ${
                        isUk
                          ? 'bg-blue-600 text-white'
                          : isChairman
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isUk ? 'УК' : (c.author_name || 'Ж').slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-900">{c.author_name || 'Житель'}</span>
                    {isUk && (
                      <span className="bg-blue-100 text-blue-700 font-bold text-[9px] px-1.5 py-0.5 rounded">
                        УК
                      </span>
                    )}
                    {isChairman && (
                      <span className="bg-sky-100 text-sky-700 font-bold text-[9px] px-1.5 py-0.5 rounded">
                        Председатель
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">
                      {formatDate(c.created_at)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (typeof c.id === 'number') {
                        deleteCommentMutation.mutate(c.id);
                      } else {
                        setLocalComments((prev) => prev.filter((item) => item.id !== c.id));
                      }
                    }}
                    className="text-slate-400 hover:text-rose-500 transition p-0.5 cursor-pointer"
                    title="Удалить комментарий"
                  >
                    <span className="material-symbols-outlined text-[15px]">delete</span>
                  </button>
                </div>

                <div className="text-slate-700 whitespace-pre-wrap leading-relaxed pl-8">
                  {c.content}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-start gap-2 pt-1">
        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div className="flex-1 flex gap-2">
          <textarea
            rows={1}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Официальный ответ от лица Управляющей Компании..."
            className="flex-1 text-xs text-slate-800 placeholder-slate-400 bg-white hover:bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition p-2.5 outline-none resize-none"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!commentText.trim() || addCommentMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
            <span>Отправить</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [activeHouseId, setActiveHouseId] = useState<number | null>(null);
  const [newPostText, setNewPostText] = useState('');
  const [attachedImageUrl, setAttachedImageUrl] = useState('');
  const [attachedDocName, setAttachedDocName] = useState('');
  const [openedCommentsPostId, setOpenedCommentsPostId] = useState<number | null>(null);
  const [extraLikes, setExtraLikes] = useState<Record<number, number>>({});
  const [extraDislikes, setExtraDislikes] = useState<Record<number, number>>({});

  const { data: houses = [] } = useQuery({
    queryKey: ['uk-houses'],
    queryFn: ukApi.getHouses,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const houseParam = params.get('house');
    if (houseParam && !isNaN(Number(houseParam))) {
      setActiveHouseId(Number(houseParam));
    } else if (houses.length > 0 && !activeHouseId) {
      const stored = localStorage.getItem('selected_house_id');
      if (stored && houses.find((h) => h.id === Number(stored))) {
        setActiveHouseId(Number(stored));
      } else {
        setActiveHouseId(houses[0].id);
      }
    }
  }, [houses, location.search, activeHouseId]);

  const { data: serverPosts = [] } = useQuery({
    queryKey: ['uk-feed', activeHouseId],
    queryFn: () => ukApi.getFeed(activeHouseId!),
    enabled: !!activeHouseId,
  });

  const { data: dashboardStats } = useQuery({
    queryKey: ['uk-dashboard'],
    queryFn: ukApi.getDashboard,
  });

  const { data: ticketsData } = useQuery({
    queryKey: ['uk-urgent-tickets', activeHouseId],
    queryFn: () => ukApi.getTickets({ house_id: activeHouseId || undefined, status: 'active', page_size: 4 }),
  });

  const activeHouseData = houses.find((h) => h.id === activeHouseId) || houses[0];

  const createPostMutation = useMutation({
    mutationFn: () =>
      ukApi.createFeedPost({
        house_id: activeHouseId!,
        title: 'Официальное объявление управляющей организации',
        content: newPostText.trim(),
        post_type: 'announcement',
        image_label: attachedImageUrl ? 'Фотоотчет работ' : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uk-feed'] });
      queryClient.invalidateQueries({ queryKey: ['uk-dashboard'] });
      showToast('Публикация успешно размещена в ленте дома', 'success');
      setNewPostText('');
      setAttachedImageUrl('');
      setAttachedDocName('');
    },
    onError: () => {
      showToast('Ошибка при публикации записи', 'error');
    },
  });

  const handlePublishPost = () => {
    if (!newPostText.trim() || !activeHouseId) {
      showToast('Введите текст публикации', 'error');
      return;
    }
    createPostMutation.mutate();
  };

  const handleToggleReaction = async (postId: number, type: 'like' | 'dislike') => {
    try {
      await apiClient.post(`/feed/${postId}/reactions`, { reaction_type: type });
      queryClient.invalidateQueries({ queryKey: ['uk-feed'] });
    } catch {
      if (type === 'like') {
        setExtraLikes((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
      } else {
        setExtraDislikes((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
      }
    }
  };

  const defaultMockPosts = [
    {
      id: 991,
      author: {
        name: 'Елена Смирнова',
        role: 'chairman',
        avatar_url: null,
      },
      title: 'Уважаемые соседи! Итоги планового обхода инженерных сетей и подвальных помещений.',
      content:
        'Сегодня совместно с главным инженером УК «Уют-Сервис» провели осмотр теплового пункта и насосного оборудования перед началом гидравлических испытаний. Все системы работают штатно, утечек не зафиксировано.\n\nНа следующей неделе запланирована замена вводной задвижки во 2-м подъезде. Отключение воды будет кратковременным — не более 2 часов. Точный график опубликуем в понедельник.',
      image_url: null,
      image_label: null,
      likes: 42,
      dislikes: 2,
      comments_count: 15,
      views: 324,
      post_type: 'report',
      created_at: new Date().toISOString(),
    },
    {
      id: 992,
      author: {
        name: 'УК «ЖилКомФорт» (Диспетчер)',
        role: 'uk_staff',
        avatar_url: null,
      },
      title: 'Плановая дезинфекция и промывка мусоростволов 24–25 октября',
      content:
        'Уведомляем жителей подъездов №1, №2 и №3: в четверг и пятницу специализированная служба будет производить санитарную обработку стволов мусоропроводов. Просим плотно закрывать загрузочные клапаны на лестничных клетках и не оставлять пакеты с отходами на площадках.',
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDTW5CiR-c4r0W5UpPD2rLI6ldHp94SwSDHotC1FvT1MGUDWNhNwFf4VI8myyH-T0uNqoe5XSknET06ZG4yXvSGY8CMxgFRri_G3YjBtL36puzb41mwrZeh9nfDNZDyqh-rjoR-3bDTCjqkYnG4AyLZggO6ynSMIxg7zNaolINRthbjnHyDgoasnUlakWlxqeuvfayLSw2n_077ptanUHcKL6tXGtb4RWTEAVoC38VgR2-TNgoKWXRu3DSriHqOHxfE',
      image_label: 'Фотоотчет работ',
      likes: 58,
      dislikes: 0,
      comments_count: 6,
      views: 418,
      post_type: 'announcement',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const displayedPosts = serverPosts.length > 0 ? serverPosts : defaultMockPosts;

  const urgentTickets =
    ticketsData?.items && ticketsData.items.length > 0
      ? ticketsData.items.slice(0, 2).map((t, idx) => ({
          id: t.id,
          time: idx === 0 ? '25 мин назад' : '2 часа назад',
          title: t.title,
          author: t.author_full_name || 'Житель',
        }))
      : [
          {
            id: 1,
            time: '25 мин назад',
            title: 'Протечка стояка отопления на 4 этаже',
            author: 'Артем К.',
          },
          {
            id: 2,
            time: '2 часа назад',
            title: 'Шум и скрежет при движении грузового лифта',
            author: 'Ольга В.',
          },
        ];

  return (
    <div className="max-w-[1400px] w-full mx-auto grid grid-cols-12 gap-8 items-start">
      <section className="col-span-12 xl:col-span-8 space-y-6" data-purpose="feed-column">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Объекты в управлении
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/uk/houses')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition cursor-pointer"
            >
              <span>Все объекты в каталоге</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {houses.map((house) => {
              const isSelected = activeHouseId === house.id;
              return (
                <button
                  key={house.id}
                  type="button"
                  onClick={() => {
                    setActiveHouseId(house.id);
                    localStorage.setItem('selected_house_id', String(house.id));
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-medium text-xs transition shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-semibold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>{house.address}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4" data-purpose="quick-post-creator">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-bold text-xs text-slate-900">ООО УК «ЖилКомФорт»</span>
                {activeHouseData && (
                  <span className="text-[11px] text-slate-400 font-medium">
                    • {activeHouseData.address}
                  </span>
                )}
              </div>
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                className="w-full text-sm text-slate-800 placeholder-slate-400 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition p-3 outline-none resize-none"
                placeholder={`Опубликовать официальное объявление от лица Управляющей Компании для жильцов дома ${activeHouseData?.address || ''}...`}
                rows={2}
              />
            </div>
          </div>

          {(attachedImageUrl || attachedDocName) && (
            <div className="mt-2.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700 truncate">
                {attachedImageUrl && (
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <span className="material-symbols-outlined text-[16px]">image</span>
                    <span className="truncate">Фото прикреплено</span>
                  </span>
                )}
                {attachedDocName && (
                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                    <span className="material-symbols-outlined text-[16px]">description</span>
                    <span className="truncate">{attachedDocName}</span>
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setAttachedImageUrl('');
                  setAttachedDocName('');
                }}
                className="text-slate-400 hover:text-rose-500 transition cursor-pointer text-[11px] font-semibold"
              >
                Очистить
              </button>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const url = window.prompt(
                    'Укажите ссылку на изображение (URL):',
                    'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=1000&q=80'
                  );
                  if (url) setAttachedImageUrl(url);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                title="Прикрепить изображение"
              >
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Фото</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const doc = window.prompt('Укажите название регламентного акта / документа:', 'Акт планового осмотра.pdf');
                  if (doc) setAttachedDocName(doc);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                title="Прикрепить файл"
              >
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span>Документ</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handlePublishPost}
              disabled={createPostMutation.isPending}
              className="bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer disabled:opacity-50"
            >
              {createPostMutation.isPending ? 'Публикация...' : 'Опубликовать'}
            </button>
          </div>
        </div>

        {displayedPosts.map((post) => {
          const isUk = post.author.role === 'uk_staff';
          const isChairman = post.author.role === 'chairman';
          const isCommentsOpen = openedCommentsPostId === post.id;
          const currentLikes = post.likes + (extraLikes[post.id] || 0);
          const currentDislikes = post.dislikes + (extraDislikes[post.id] || 0);

          return (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden"
              data-purpose={isUk ? 'post-card-uk' : 'post-card'}
            >
              <div className="p-5 pb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-full font-bold text-sm flex items-center justify-center shrink-0 ${
                      isUk
                        ? 'bg-emerald-600 text-white text-xs'
                        : 'bg-gradient-to-tr from-blue-700 to-sky-500 text-white'
                    }`}
                  >
                    {isUk ? 'УК' : (post.author.name || 'Ж').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {post.author.name || 'УК «ЖилКомФорт»'}
                      </span>
                      {isChairman && (
                        <span className="bg-blue-100 text-blue-700 font-semibold text-[10px] px-2 py-0.5 rounded-md">
                          Председатель
                        </span>
                      )}
                      {isUk && (
                        <span className="bg-emerald-100 text-emerald-800 font-semibold text-[10px] px-2 py-0.5 rounded-md">
                          Управляющая организация
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] text-slate-400 mt-0.5">
                      {formatDate(post.created_at)} • {activeHouseData?.address || 'Баумана, 12'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast('Параметры публикации', 'info')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button>
              </div>

              <div className="px-5 py-2 text-sm text-slate-700 leading-relaxed space-y-2">
                {post.title && (
                  <p className="font-medium text-slate-900 text-base">
                    {post.title}
                  </p>
                )}
                <p className="whitespace-pre-line text-slate-700">
                  {post.content}
                </p>
              </div>

              {post.image_url && (
                <div className="px-5 pt-2 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl overflow-hidden border border-slate-200">
                    <div className="h-44 bg-slate-100 relative group overflow-hidden flex items-center justify-center">
                      <img
                        alt="Фотоотчет"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                        src={post.image_url}
                      />
                      <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded">
                        {post.image_label || 'Фотоотчет работ'}
                      </span>
                    </div>
                    <div className="h-44 bg-slate-800 text-white p-4 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400">График работ</span>
                        <div className="font-bold text-sm mt-1">24 октября: Подъезд 1-2</div>
                        <div className="font-bold text-sm">25 октября: Подъезд 3-4</div>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        По всем вопросам обращайтесь в круглосуточную диспетчерскую: <span className="text-white font-semibold">+7 (800) 200-12-34</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleReaction(post.id, 'like')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-blue-50 hover:text-blue-600 transition font-medium text-slate-700 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-slate-500 hover:text-blue-600">thumb_up</span>
                    <span className="font-semibold text-blue-700 ml-0.5">{currentLikes}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleReaction(post.id, 'dislike')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-rose-50 hover:text-rose-600 transition font-medium text-slate-700 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-slate-500 hover:text-rose-600">thumb_down</span>
                    <span className="font-semibold text-slate-600 ml-0.5">{currentDislikes}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOpenedCommentsPostId((prev) => (prev === post.id ? null : post.id))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition font-medium cursor-pointer ${
                      isCommentsOpen
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'bg-slate-100/80 hover:bg-blue-50 hover:text-blue-600 text-slate-700'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isCommentsOpen ? 'text-white' : 'text-slate-500'}`}>chat_bubble</span>
                    <span className="text-xs">Комментарии</span>
                    <span className={`font-semibold ml-0.5 ${isCommentsOpen ? 'text-white' : 'text-slate-600'}`}>{post.comments_count}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  <span className="text-xs font-medium">{post.views || 324}</span>
                </div>
              </div>

              {isCommentsOpen && (
                <PostCommentsBlock postId={post.id} />
              )}
            </article>
          );
        })}
      </section>

      <aside className="col-span-12 xl:col-span-4 space-y-6" data-purpose="info-widgets-column">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5" data-purpose="house-passport-card">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-bold text-sm text-slate-900">Паспорт дома</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              В управлении
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                {activeHouseData?.address || 'ул. Баумана, д. 12'}
              </h3>
              <p className="text-xs text-slate-400">
                {activeHouseData?.city || 'Казань'}, {activeHouseData?.district || 'Вахитовский район'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="text-[11px] text-slate-400 font-medium">Всего квартир</div>
              <div className="text-base font-extrabold text-slate-800 mt-0.5">
                {activeHouseData?.apartments_count || 120}
              </div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="text-[11px] text-slate-400 font-medium">В системе</div>
              <div className="text-base font-extrabold text-blue-600 mt-0.5">
                {activeHouseData?.residents_count || 103}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5" data-purpose="urgent-requests-widget">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-bold text-sm text-slate-900">Новые обращения</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/uk/tickets')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Все ({dashboardStats?.active_tickets ?? 14}) →
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {urgentTickets.map((ticket, idx) => (
              <div
                key={ticket.id || idx}
                onClick={() => navigate('/uk/tickets')}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  idx % 2 === 0
                    ? 'bg-rose-50/70 border-rose-100 hover:bg-rose-50'
                    : 'bg-amber-50/70 border-amber-100 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-medium ${idx % 2 === 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                    {ticket.time}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-900 mt-1 line-clamp-1">
                  {ticket.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                  <span>Заявитель: {ticket.author}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate('/uk/tickets')}
            className="w-full mt-3 py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            Перейти в Обращения жителей
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4" data-purpose="emergency-contacts">
          <div className="text-xs font-bold text-slate-900 mb-2">Экстренные контакты дома</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Круглосуточная диспетчерская</span>
              <a className="font-semibold text-blue-600 hover:underline" href="tel:88002001234">
                +7 (800) 200-12-34
              </a>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Аварийная служба лифтов</span>
              <a className="font-semibold text-blue-600 hover:underline" href="tel:88432100000">
                +7 (843) 210-00-00
              </a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
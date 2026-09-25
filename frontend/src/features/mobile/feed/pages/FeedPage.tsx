import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../../../../shared/types/feed';

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    authorName: 'Елена Смирнова',
    roleBadge: 'Председатель',
    avatarText: 'ЕС',
    time: '1 час назад',
    content:
      'Уважаемые соседи! Совместно с УК согласовали план весеннего благоустройства дворовой территории. Пожалуйста, примите участие в голосовании по установке шлагбаума и камер во дворе на вкладке «Опросы»!',
    likes: 24,
    dislikes: 2,
    commentsCount: 12,
    views: '1,4K',
    type: 'chairman',
  },
  {
    id: '2',
    authorName: 'УК «ЖилКомФорт»',
    isOrg: true,
    time: 'Сегодня, 09:30',
    subtitle: 'Управляющая организация',
    title: 'Завершён плановый ремонт кровли над 3-м подъездом',
    content:
      'Приемка работ проведена комиссионно с участием членов Совета МКД. Подписан акт гарантийных обязательств подрядчика на 3 года.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAHFVRJmxqdGE_lpT6cBAITROxeA-h_oZGR0Z9CoVBg8Trn--Dky7rBF6tr4XlkGrJxwy1AljMFkDT43gfN_pAceb-XT2dZBJj4Ipf6A0QaDz3Y5urpS8TYAJyK-76YwkUt_o4dNsruHJPsuV9b56RO0Z0hq9BrAyqn5bMfCVsN2K6nhsPYciWl-ze5_C0r-0d9FGxxNs6ECnFSW4pG-gTsLhJ7j40wuju9ejTvUo2ld5Gu5YJg8HI',
    imageLabel: 'Фотоотчет приёмки',
    likes: 19,
    dislikes: 0,
    commentsCount: 5,
    views: '890',
    type: 'uk',
  },
  {
    id: '3',
    authorName: 'УК «ЖилКомФорт»',
    isOrg: true,
    time: 'Вчера, 17:40',
    subtitle: 'Управляющая организация',
    title: 'Весенняя промывка стволов мусоропроводов',
    content:
      'Со вторника по четверг в подъездах 1–4 будет проводиться комплексная санитарная промывка стволов мусоропроводов и дезинфекция мусорокамер. Просим плотно закрывать клапаны на этажах во время проведения работ.',
    likes: 8,
    dislikes: 1,
    commentsCount: 0,
    views: '450',
    type: 'uk',
  },
];

export const FeedPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'uk' | 'chairman'>('all');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleDislike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, dislikes: p.dislikes + 1 } : p))
    );
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === 'all') return true;
    return post.type === filter;
  });

  return (
    <div className="flex flex-col w-full">
      <header className="sticky top-0 w-full z-40 pt-safe bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-xs">
        <div className="px-4 pt-2.5 pb-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkYm6uN-SPDRG3OYFTY77L_tQVs7uXdM0VPSlHs-fnsBXxTuGcfGvixZuyQom3idEHVU4ErZNB4YtLgOEhgYzYDB6kUBzznXy5yJzQZ0BiLDMWH7Ob1aiqdu5enNDia-kH6jGzb6Dzg2gLBcBcKmYwSAYTR0hpplcS0cu7JEZR5c1wn8nKknILRH8TIgg9xUemvj3BdGmxfdzd7q-GOHLvHmQwBxbOO18npMyTWhodoZGtWw2wvFk3L0HIj5YkRi6x"
                alt="Мой Дом"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-bold text-[17px] text-slate-900 tracking-tight">МОЙ ДОМ</span>
            </div>
            <div className="relative">
              <button
                type="button"
                aria-label="Уведомления"
                onClick={() => navigate('/notifications')}
                className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 active:scale-95 border border-slate-200/60 flex items-center justify-center text-slate-700 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white pointer-events-none" />
            </div>
          </div>

          <div>
            <button
              type="button"
              className="flex flex-col text-left group active:scale-[0.99] transition-transform w-full"
            >
              <div className="flex items-center gap-1">
                <span className="text-[19px] font-bold text-slate-900 leading-snug tracking-tight">
                  Александр Смирнов
                </span>
                <span className="material-symbols-outlined text-[19px] text-slate-400 group-hover:text-primary transition-colors">
                  expand_more
                </span>
              </div>
              <span className="text-[13px] text-slate-500 font-medium tracking-normal flex items-center gap-1.5">
                <span>Квартира 48</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>ул. Баумана, д. 12</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide transition-all active:scale-95 ${
              filter === 'all'
                ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/15'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:text-slate-900'
            }`}
          >
            Все
          </button>
          <button
            type="button"
            onClick={() => setFilter('uk')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all active:scale-95 ${
              filter === 'uk'
                ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/15 font-semibold'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:text-slate-900'
            }`}
          >
            УК
          </button>
          <button
            type="button"
            onClick={() => setFilter('chairman')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all active:scale-95 ${
              filter === 'chairman'
                ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/15 font-semibold'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:text-slate-900'
            }`}
          >
            Председатель
          </button>
        </div>
      </div>

      <section className="px-4 flex flex-col gap-3.5 pb-8">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => navigate(`/feed/${post.id}`)}
            className="p-4 sm:p-5 rounded-[22px] bg-white border border-slate-100 shadow-sm flex flex-col gap-3.5 cursor-pointer active:scale-[0.99] transition-all hover:border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {post.isOrg ? (
                  <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">domain</span>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center font-bold text-[14px] shadow-sm tracking-wide shrink-0">
                    {post.avatarText}
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-slate-900 leading-tight">
                      {post.authorName}
                    </span>
                    {post.roleBadge && (
                      <span className="px-2 py-0.5 rounded-md bg-[#2aabee] text-white text-[11px] font-bold leading-tight tracking-wide">
                        {post.roleBadge}
                      </span>
                    )}
                  </div>
                  <span className="text-[12px] text-slate-400 font-normal mt-0.5">
                    {post.time} {post.subtitle ? `• ${post.subtitle}` : ''}
                  </span>
                </div>
              </div>

              <button
                type="button"
                aria-label="Опции"
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">more_vert</span>
              </button>
            </div>

            <div>
              {post.title && (
                <h4 className="text-[16px] font-bold text-slate-900 leading-snug mb-1">
                  {post.title}
                </h4>
              )}
              <p className="text-[14px] text-slate-700 leading-relaxed font-normal">
                {post.content}
              </p>
            </div>

            {post.image && (
              <div className="w-full h-44 rounded-2xl overflow-hidden relative shadow-inner">
                <img
                  src={post.image}
                  alt={post.title || 'Фотоотчет'}
                  className="w-full h-full object-cover"
                />
                {post.imageLabel && (
                  <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-full bg-slate-900/65 text-white text-[11px] font-medium backdrop-blur-md flex items-center gap-1.5 shadow-sm border border-white/15">
                    <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                    <span>{post.imageLabel}</span>
                  </div>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleLike(post.id, e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-full text-[13px] font-semibold transition active:scale-95 border border-sky-100"
                >
                  <span className="material-symbols-outlined text-[17px]">thumb_up</span>
                  <span>{post.likes}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDislike(post.id, e)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full text-[13px] font-medium transition active:scale-95 border border-slate-200/80"
                >
                  <span className="material-symbols-outlined text-[17px]">thumb_down</span>
                  <span>{post.dislikes}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/feed/${post.id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full text-[13px] font-medium transition active:scale-95 border border-slate-200/80"
                >
                  <span className="material-symbols-outlined text-[17px] text-slate-500">
                    chat_bubble
                  </span>
                  <span>{post.commentsCount}</span>
                </button>
              </div>

              <div className="flex items-center gap-1 text-slate-400 text-[13px] font-medium">
                <span className="material-symbols-outlined text-[17px]">visibility</span>
                <span>{post.views}</span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};
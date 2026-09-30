import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHaptic } from '../../../../shared/hooks/useHaptic';
import { useFeed } from '../hooks/useFeed';
import { APP_LOGO_SRC } from '../../../../shared/constants/branding';
import { useUnreadNotifications } from '../../../../shared/hooks/useUnreadNotifications';
import { PostActionMenu } from '../components/PostActionMenu';

export const FeedPage: React.FC = () => {
  const navigate = useNavigate();
  const { impact } = useHaptic();
  const { hasUnread } = useUnreadNotifications();

  const [filter, setFilter] = useState<'all' | 'uk' | 'chairman'>('all');
  const { posts, isLoading, toggleReaction, refetch } = useFeed(filter);

  const [currentUser, setCurrentUser] = useState({
    fullName: 'Елена Смирнова',
    role: 'chairman',
    roleLabel: 'Председатель',
    houseAddress: 'ул. Баумана, д. 12',
    apartment: '48',
  });

  useEffect(() => {
    const raw = localStorage.getItem('current_user');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setCurrentUser({
          fullName: parsed.full_name || parsed.fullName || 'Житель',
          role: parsed.role || 'resident',
          roleLabel: parsed.role === 'chairman' ? 'Председатель' : parsed.role === 'uk_staff' ? 'УК' : 'Житель',
          houseAddress: parsed.house_address || parsed.houseAddress || 'ул. Баумана, д. 12',
          apartment: parsed.apartment_number || parsed.apartment || '48',
        });
      } catch {}
    }
  }, []);

  const handleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    impact('light');
    try {
      await toggleReaction({ postId: id, reactionType: 'like' });
    } catch {}
  };

  const handleDislike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    impact('light');
    try {
      await toggleReaction({ postId: id, reactionType: 'dislike' });
    } catch {}
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === 'uk') return post.type === 'uk';
    if (filter === 'chairman') return post.type === 'chairman';
    return true;
  });

  return (
    <div className="flex flex-col w-full relative">
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all">
        <div className="px-4 pt-2.5 pb-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <img
                  src={APP_LOGO_SRC}
                  alt="Мой Дом"
                  className="w-8 h-8 rounded-full object-contain bg-white shadow-xs border border-slate-200/80 shrink-0"
                />
                <span className="font-bold text-[17px] text-slate-900 tracking-tight">МОЙ ДОМ</span>
              </div>
            </div>
            <div className="relative">
              <button
                type="button"
                aria-label="Уведомления"
                onClick={() => navigate('/notifications')}
                className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 active:scale-95 border border-slate-200/60 flex items-center justify-center text-slate-700 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[21px]">notifications</span>
              </button>
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white pointer-events-none" />
              )}
            </div>
          </div>

          <div className="pt-0.5">
            <button
              type="button"
              className="flex flex-col text-left group active:scale-[0.99] transition-transform w-full"
              id="addressDropdownBtn"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[20px] font-bold text-slate-900 leading-snug tracking-tight">
                  {currentUser.fullName}
                </span>
                {currentUser.role === 'chairman' && (
                  <span className="px-2 py-0.5 rounded-md bg-[#2aabee] text-white text-[11px] font-bold leading-tight tracking-wide">
                    Председатель
                  </span>
                )}
                <span className="material-symbols-outlined text-[19px] text-slate-400 group-hover:text-primary transition-colors">
                  expand_more
                </span>
              </div>
              <span className="text-[13px] text-slate-500 font-medium tracking-normal mt-0.5 flex items-center gap-1.5">
                <span>Квартира {currentUser.apartment}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>{currentUser.houseAddress}</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full pb-24 bg-surface pt-3">
        <div className="flex flex-col w-full space-y-3.5">
          <section className="px-4">
            <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide shadow-sm transition-all active:scale-95 cursor-pointer ${
                  filter === 'all'
                    ? 'bg-slate-900 text-white shadow-slate-900/15'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                Все
              </button>
              <button
                type="button"
                onClick={() => setFilter('uk')}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                  filter === 'uk'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <span>УК</span>
              </button>
              <button
                type="button"
                onClick={() => setFilter('chairman')}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                  filter === 'chairman'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <span>Председатель</span>
              </button>
            </div>
          </section>

          <section className="px-4 flex flex-col gap-3.5">
            {isLoading && (
              <div className="flex flex-col gap-3 py-6 items-center justify-center">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {!isLoading && filteredPosts.length === 0 && (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-sm text-slate-400 text-sm">
                Нет публикаций в данном разделе
              </div>
            )}
            {filteredPosts.map((post) => {
              const displayImage = post.images && post.images.length > 0 ? post.images[0] : post.image;
              const imagesCount = post.images?.length || (post.image ? 1 : 0);

              return (
                <article
                  key={post.id}
                  onClick={() => navigate(`/feed/${post.id}`)}
                  className="p-4 sm:p-5 rounded-[22px] bg-white border border-slate-100/90 shadow-card flex flex-col gap-3.5 cursor-pointer hover:border-slate-200 transition-all active:scale-[0.995]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {post.isOrg ? (
                        <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">domain</span>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center font-bold text-[14px] shadow-sm tracking-wide">
                          {post.avatarText || 'ЕС'}
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
                          {post.time}
                        </span>
                      </div>
                    </div>
                    <PostActionMenu
                      postId={post.id}
                      postTitle={post.title}
                      postContent={post.content}
                      isOwnerOrStaff={currentUser.role === 'chairman' || currentUser.role === 'uk_staff'}
                      onDeleted={refetch}
                    />
                  </div>

                  <div>
                    {post.title && (
                      <h4 className="text-[16px] font-bold text-slate-900 leading-snug">
                        {post.title}
                      </h4>
                    )}
                    <p className="text-[14px] text-slate-700 mt-1.5 leading-relaxed font-normal">
                      {post.content}
                    </p>
                  </div>

                  {displayImage && (
                    <div className="w-full h-44 rounded-2xl overflow-hidden relative shadow-inner group">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={displayImage}
                        alt={post.title || 'Фотоотчет'}
                      />
                      {imagesCount > 1 && (
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-slate-900/75 text-white text-[11px] font-semibold backdrop-blur-md flex items-center gap-1 shadow-sm border border-white/20">
                          <span className="material-symbols-outlined text-[14px]">collections</span>
                          <span>{imagesCount} фото</span>
                        </div>
                      )}
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
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-full text-[13px] font-semibold transition active:scale-95 border border-sky-100 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[17px]">thumb_up</span>
                        <span>{post.likes}</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDislike(post.id, e)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full text-[13px] font-medium transition active:scale-95 border border-slate-200/80 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[17px]">thumb_down</span>
                        <span>{post.dislikes}</span>
                      </button>
                      <button
                        type="button"
                        aria-label="Комментарии"
                        onClick={() => navigate(`/feed/${post.id}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full text-[13px] font-medium transition active:scale-95 border border-slate-200/80 cursor-pointer"
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
              );
            })}
          </section>
        </div>
      </main>

      {currentUser.role === 'chairman' && (
        <div className="fixed bottom-20 right-4 z-50">
          <button
            type="button"
            onClick={() => navigate('/chairman/create-post')}
            className="flex items-center gap-2 px-4 py-3 bg-[#0284c7] hover:bg-sky-600 active:scale-95 text-white font-semibold text-[14px] rounded-full shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Новая публикация</span>
          </button>
        </div>
      )}
    </div>
  );
};
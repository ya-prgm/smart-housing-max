import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeed } from '../../mobile/feed/hooks/useFeed';
import { Skeleton } from '../../../shared/ui/Skeleton';
import { APP_LOGO_SRC } from '../../../shared/constants/branding';
import { useUnreadNotifications } from '../../../shared/hooks/useUnreadNotifications';
import { PostActionMenu } from '../../mobile/feed/components/PostActionMenu';

export const ChairmanFeedPage: React.FC = () => {
  const navigate = useNavigate();
  const { hasUnread } = useUnreadNotifications();
  const [feedType, setFeedType] = React.useState<'all' | 'uk' | 'chairman'>('all');
  const { posts, isLoading, refetch } = useFeed(feedType);

  return (
    <div className="flex flex-col w-full min-h-screen pb-28 bg-[#f8fafc] text-slate-900 select-none">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all">
        <div className="px-4 pt-2.5 pb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-white shadow-xs border border-slate-200/80">
              <img src={APP_LOGO_SRC} alt="Логотип" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-bold text-slate-900 tracking-tight truncate leading-none">
                  МОЙ ДОМ
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold">
                  Председатель
                </span>
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 truncate leading-none">
                Квартира 48 • ул. Баумана, д. 12
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Уведомления"
            onClick={() => navigate('/notifications')}
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-200/60 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>
        </div>
      </header>

      <div className="flex items-center gap-2 px-4 pt-3 pb-1.5">
        {[
          { id: 'all' as const, label: 'Все' },
          { id: 'uk' as const, label: 'УК' },
          { id: 'chairman' as const, label: 'Председатель' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFeedType(tab.id)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all active:scale-95 cursor-pointer ${
              feedType === tab.id
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-white text-slate-600 border border-slate-200/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main className="px-4 pt-2 flex flex-col gap-3.5 pb-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-3xl" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <span className="material-symbols-outlined text-[56px] mb-3">article</span>
            <p className="text-[15px] font-medium text-center">Лента пуста</p>
            <p className="text-[12px] text-slate-400 mt-1 text-center max-w-[220px]">
              Создайте первый пост для жильцов
            </p>
          </div>
        ) : (
          posts.map((post) => {
            const isChairman = post.type === 'chairman';
            const isOrg = post.isOrg;

            return (
              <article
                key={post.id}
                onClick={() => navigate(`/feed/${post.id}`)}
                className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-card cursor-pointer active:scale-[0.99] transition-transform flex flex-col gap-2.5"
              >
                <div className="flex items-center gap-2.5 justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] font-bold shrink-0 ${
                        isChairman
                          ? 'bg-gradient-to-tr from-[#006591] to-[#0088cc]'
                          : isOrg
                          ? 'bg-primary'
                          : 'bg-slate-600'
                      }`}
                    >
                      {post.avatarText || post.authorName?.charAt(0) || 'A'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[14px] font-semibold text-slate-900 truncate">
                          {post.authorName}
                        </span>
                        {post.roleBadge && (
                          <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold">
                            {post.roleBadge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[11px] text-slate-500">{post.time}</span>
                        {post.subtitle && (
                          <>
                            <span className="text-[11px] text-slate-300">•</span>
                            <span className="text-[11px] text-slate-500 truncate">{post.subtitle}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <PostActionMenu
                    postId={post.id}
                    postTitle={post.title}
                    postContent={post.content}
                    isOwnerOrStaff={true}
                    onDeleted={refetch}
                  />
                </div>

                {post.title && (
                  <h2 className="text-[15px] font-bold text-slate-900 leading-snug">{post.title}</h2>
                )}

                <p className="text-[13px] text-slate-700 leading-relaxed line-clamp-4">{post.content}</p>

                {post.image && (
                  <div className="w-full h-40 rounded-2xl overflow-hidden relative mt-0.5 border border-slate-100">
                    <img src={post.image} alt="" className="w-full h-full object-cover" />
                    {post.imageLabel && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                        {post.imageLabel}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4 mt-1 pt-2 border-t border-slate-100/80">
                  <div className="flex items-center gap-1 text-[12px] text-primary font-semibold">
                    <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                    {post.likes}
                  </div>
                  <div className="flex items-center gap-1 text-[12px] text-slate-400">
                    <span className="material-symbols-outlined text-[16px]">thumb_down</span>
                    {post.dislikes}
                  </div>
                  <div className="flex items-center gap-1 text-[12px] text-slate-400">
                    <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                    {post.commentsCount}
                  </div>
                  <div className="flex items-center gap-1 text-[12px] text-slate-400 ml-auto">
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    {post.views}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </main>

      <button
        type="button"
        onClick={() => navigate('/chairman/create-post')}
        className="fixed bottom-24 right-4 max-w-[430px] flex items-center gap-2 px-5 py-3.5 bg-primary hover:bg-[#00557a] text-white rounded-full font-bold text-[14px] shadow-card active:scale-95 transition-all cursor-pointer z-30"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        Новая публикация
      </button>
    </div>
  );
};

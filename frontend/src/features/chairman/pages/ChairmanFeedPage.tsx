import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeed } from '../../mobile/feed/hooks/useFeed';
import { Skeleton } from '../../../shared/ui/Skeleton';

export const ChairmanFeedPage: React.FC = () => {
  const navigate = useNavigate();
  const [feedType, setFeedType] = React.useState<'all' | 'uk' | 'chairman'>('all');
  const { posts, isLoading } = useFeed(feedType);

  return (
    <div className="flex flex-col w-full min-h-screen pb-28 bg-[#f7f9ff] text-slate-900 select-none">
      {/* Header — matches design */}
      <header className="sticky top-0 z-40 pt-safe bg-[#f7f9ff]/85 backdrop-blur-xl border-b border-slate-200/70 shadow-xs">
        <div className="h-14 px-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#ecf4ff] flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[22px]">apartment</span>
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
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#f7f9ff]" />
          </button>
        </div>
      </header>

      {/* Feed type filter tabs */}
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
              <Skeleton key={i} className="h-48 w-full rounded-[20px]" />
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
                className="bg-white rounded-[20px] p-4 border border-slate-100 shadow-sm cursor-pointer active:scale-[0.99] transition-transform flex flex-col gap-2.5"
              >
                {/* Author row */}
                <div className="flex items-center gap-2.5 justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] font-bold shrink-0 ${
                      isChairman ? 'bg-indigo-500' : isOrg ? 'bg-blue-500' : 'bg-slate-500'
                    }`}>
                      {post.avatarText || post.authorName?.charAt(0) || 'A'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[14px] font-semibold text-slate-900 truncate">{post.authorName}</span>
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
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </div>

                {/* Title */}
                {post.title && (
                  <h2 className="text-[15px] font-bold text-slate-900 leading-snug">{post.title}</h2>
                )}

                {/* Content */}
                <p className="text-[13px] text-slate-700 leading-relaxed line-clamp-4">{post.content}</p>

                {/* Image */}
                {post.image && (
                  <div className="w-full h-40 rounded-xl overflow-hidden relative mt-0.5">
                    <img src={post.image} alt="" className="w-full h-full object-cover" />
                    {post.imageLabel && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2.5 py-1 bg-black/60 rounded-lg text-white text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                        {post.imageLabel}
                      </div>
                    )}
                  </div>
                )}

                {/* Reactions */}
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

      {/* FAB: New Post */}
      <button
        type="button"
        onClick={() => navigate('/chairman/create-post')}
        className="fixed bottom-24 right-4 max-w-[430px] flex items-center gap-2 px-5 py-3.5 bg-primary text-white rounded-full font-bold text-[14px] shadow-xl active:scale-95 transition-transform cursor-pointer z-30"
        style={{ boxShadow: '0 6px 20px rgba(0,86,196,0.35)' }}
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        Новая публикация
      </button>
    </div>
  );
};

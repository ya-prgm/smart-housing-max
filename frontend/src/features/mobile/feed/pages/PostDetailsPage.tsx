import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePostDetails } from '../hooks/useFeed';
import { feedApi } from '../api';
import { useHaptic } from '../../../../shared/hooks/useHaptic';

export const PostDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const postId = id || '1';

  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const { post, comments, addComment } = usePostDetails(postId, sortOption);
  const { impact } = useHaptic();

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  // Photo Carousel State
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const postImages = post?.images && post.images.length > 0 ? post.images : post?.image ? [post.image] : [];

  React.useEffect(() => {
    if (post) {
      setLikes(post.likes);
      setDislikes(post.dislikes);
      setCurrentImageIdx(0);
    }
  }, [post]);

  const handleLike = async () => {
    impact('light');
    setLikes((l) => l + 1);
    try {
      await feedApi.toggleReaction(postId, 'like');
    } catch {}
  };

  const handleDislike = async () => {
    impact('light');
    setDislikes((d) => d + 1);
    try {
      await feedApi.toggleReaction(postId, 'dislike');
    } catch {}
  };

  const handleSendComment = async () => {
    if (!commentInput.trim()) return;
    impact('medium');
    const textToSend = replyTo ? `${replyTo}, ${commentInput}` : commentInput;
    try {
      await addComment(textToSend);
      setCommentInput('');
      setReplyTo(null);
    } catch {}
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe && postImages.length > 1) {
      setCurrentImageIdx((prev) => (prev < postImages.length - 1 ? prev + 1 : 0));
      impact('light');
    }
    if (isRightSwipe && postImages.length > 1) {
      setCurrentImageIdx((prev) => (prev > 0 ? prev - 1 : postImages.length - 1));
      impact('light');
    }
  };

  const sortLabels: Record<'newest' | 'oldest' | 'popular', string> = {
    newest: 'Сначала новые',
    oldest: 'Сначала старые',
    popular: 'Сначала популярные',
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortOption === 'newest') {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : parseInt(a.id, 10) || 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : parseInt(b.id, 10) || 0;
      return timeB - timeA;
    }
    if (sortOption === 'oldest') {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : parseInt(a.id, 10) || 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : parseInt(b.id, 10) || 0;
      return timeA - timeB;
    }
    if (sortOption === 'popular') {
      const repA = a.replies?.length || 0;
      const repB = b.replies?.length || 0;
      return repB - repA || (b.text?.length || 0) - (a.text?.length || 0);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center selection:bg-primary/20">
      <div className="w-full max-w-[430px] min-h-screen bg-[#f7f9ff] text-[#141c24] flex flex-col relative select-none shadow-2xl overflow-x-hidden">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] px-4 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              type="button"
              aria-label="Назад"
              onClick={() => navigate('/feed')}
              className="text-slate-800 hover:text-sky-600 transition-colors p-1 -ml-1 rounded-full flex items-center justify-center shrink-0 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-[17px] font-semibold tracking-tight text-slate-900 leading-tight truncate">
                {post?.title || 'Публикация'}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-1 shrink-0">
            <button
              type="button"
              aria-label="Опции"
              className="text-slate-500 hover:text-slate-800 p-1.5 rounded-full transition-colors flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">more_vert</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-28">
          <article className="bg-white border-b border-slate-200/80 p-4 pt-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {post?.isOrg ? (
                  <div className="w-11 h-11 rounded-full bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">domain</span>
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-full ring-2 ring-[#2aabee] bg-gradient-to-tr from-[#006591] to-[#2aabee] flex items-center justify-center overflow-hidden text-white font-semibold text-sm shadow-sm shrink-0">
                    {post?.avatarText || 'ЕС'}
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-0.5">
                    <span className="font-semibold text-[15px] text-[#0f172a]">
                      {post?.authorName || 'Автор'}
                    </span>
                    {post?.roleBadge && (
                      <span className="px-2 py-0.5 bg-[#ecf4ff] text-[#006591] text-[10px] font-bold rounded-md border border-[#c9e6ff]">
                        {post.roleBadge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1.5 text-[12px] text-[#64748b] mt-0.5">
                    <span>{post?.time || 'Сегодня'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3.5 space-y-2 text-[14px] text-[#334155] leading-relaxed">
              {post?.title && (
                <h2 className="font-bold text-[17px] text-[#0f172a] leading-snug">
                  {post.title}
                </h2>
              )}
              <p className="whitespace-pre-line text-[14.5px]">
                {post?.content || 'Загрузка содержимого...'}
              </p>
            </div>

            {/* REAL PHOTO GALLERY / CAROUSEL */}
            {postImages.length > 0 && (
              <div className="mt-4">
                <div
                  className="relative w-full aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm flex flex-col justify-between cursor-pointer group"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onClick={() => setIsLightboxOpen(true)}
                >
                  {/* Photo Display */}
                  <img
                    src={postImages[currentImageIdx]}
                    alt={`Фото ${currentImageIdx + 1}`}
                    className="w-full h-full object-cover transition-all duration-300 select-none"
                  />

                  {/* Top Bar with Counter and Fullscreen Zoom */}
                  <div className="absolute top-3 inset-x-3 flex justify-between items-center z-10 pointer-events-none">
                    <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white tracking-wider pointer-events-auto">
                      {currentImageIdx + 1} / {postImages.length}
                    </div>

                    <button
                      type="button"
                      aria-label="Открыть во весь экран"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLightboxOpen(true);
                      }}
                      className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95 pointer-events-auto cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                    </button>
                  </div>

                  {/* Previous / Next Arrow Controls */}
                  {postImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Предыдущее фото"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIdx((prev) => (prev > 0 ? prev - 1 : postImages.length - 1));
                          impact('light');
                        }}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/55 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-90 z-20 cursor-pointer shadow-md"
                      >
                        <span className="material-symbols-outlined text-[22px]">chevron_left</span>
                      </button>

                      <button
                        type="button"
                        aria-label="Следующее фото"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIdx((prev) => (prev < postImages.length - 1 ? prev + 1 : 0));
                          impact('light');
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/55 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-90 z-20 cursor-pointer shadow-md"
                      >
                        <span className="material-symbols-outlined text-[22px]">chevron_right</span>
                      </button>
                    </>
                  )}

                  {/* Bottom Indicators & Label */}
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col gap-1.5 z-10 pointer-events-none">
                    {post?.imageLabel && (
                      <p className="text-white text-xs font-medium tracking-wide drop-shadow-sm px-1 truncate">
                        {post.imageLabel}
                      </p>
                    )}

                    {postImages.length > 1 && (
                      <div className="flex justify-center items-center space-x-1.5 pt-0.5 pointer-events-auto">
                        {postImages.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            aria-label={`Перейти к фото ${idx + 1}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIdx(idx);
                              impact('light');
                            }}
                            className={`h-1.5 rounded-full transition-all cursor-pointer ${
                              currentImageIdx === idx
                                ? 'w-5 bg-sky-400'
                                : 'w-1.5 bg-white/60 hover:bg-white'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleLike}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#ecf4ff] hover:bg-[#c9e6ff] text-[#006591] rounded-full text-[13px] font-semibold transition active:scale-95 border border-[#c9e6ff] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">thumb_up</span>
                  <span>{likes}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDislike}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-[#f7f9ff] hover:bg-[#e6effa] text-[#6e7881] rounded-full text-[13px] font-medium transition active:scale-95 border border-[#dae3ef] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">thumb_down</span>
                  <span>{dislikes}</span>
                </button>
              </div>
              <div className="flex items-center space-x-1 text-[#6e7881] text-[13px] font-medium">
                <span className="material-symbols-outlined text-[17px]">visibility</span>
                <span>{post?.views || '1,4K'}</span>
              </div>
            </div>
          </article>

          {/* COMMENTS SECTION */}
          <section className="px-4 py-3 bg-white mt-2">
            <div className="flex items-center justify-between pb-3 pt-1 border-b border-slate-100 relative">
              <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
                КОММЕНТАРИИ ({comments.length})
              </span>

              {/* Sorting Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                  className="flex items-center space-x-1 text-sky-600 text-xs font-semibold hover:text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100 transition-colors cursor-pointer active:scale-95"
                >
                  <span>{sortLabels[sortOption]}</span>
                  <span className="material-symbols-outlined text-[16px] transition-transform duration-200">
                    {isSortMenuOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {isSortMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-30 animate-fadeIn">
                    {(Object.keys(sortLabels) as Array<'newest' | 'oldest' | 'popular'>).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSortOption(key);
                          setIsSortMenuOpen(false);
                          impact('light');
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                          sortOption === key ? 'text-sky-600 font-bold bg-sky-50/60' : 'text-slate-700'
                        }`}
                      >
                        <span>{sortLabels[key]}</span>
                        {sortOption === key && (
                          <span className="material-symbols-outlined text-[16px] text-sky-600">
                            check
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-3.5">
              {sortedComments.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-sm">
                  Нет комментариев. Будьте первым!
                </div>
              ) : (
                sortedComments.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    <div className="flex space-x-3 items-start">
                      <div
                        className={`w-9 h-9 rounded-full border shrink-0 flex items-center justify-center text-xs font-semibold ${
                          comment.avatarBg || 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        {comment.avatarText}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5 flex-wrap">
                          <span className="font-semibold text-sm text-slate-900">
                            {comment.authorName}
                          </span>
                          {comment.roleBadge && (
                            <span className="px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200/60 text-[11px] font-medium rounded-full">
                              {comment.roleBadge}
                            </span>
                          )}
                        </div>
                        <p className="text-[14px] leading-relaxed font-normal text-slate-700 mt-1 break-words">
                          {comment.text}
                        </p>

                        <div className="flex items-center space-x-3 mt-1.5 text-xs text-slate-400">
                          <span>{comment.time}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setReplyTo(comment.authorName);
                              impact('light');
                            }}
                            className="text-sky-600 font-medium hover:underline cursor-pointer"
                          >
                            Ответить
                          </button>
                        </div>
                      </div>
                    </div>

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-5 sm:ml-9 pl-3.5 border-l-2 border-sky-100 space-y-3.5 pt-1">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex space-x-3 items-start">
                            <div
                              className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                                reply.avatarBg || 'bg-slate-100 border-slate-200 text-slate-700'
                              }`}
                            >
                              {reply.avatarText}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                                <span className="font-semibold text-sm text-slate-900">
                                  {reply.authorName}
                                </span>
                                {reply.roleBadge && (
                                  <span className="px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200/60 text-[11px] font-medium rounded-full">
                                    {reply.roleBadge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[14px] leading-relaxed font-normal text-slate-700 mt-1 break-words">
                                {reply.text}
                              </p>
                              <div className="flex items-center space-x-3 mt-1.5 text-xs text-slate-400">
                                <span>{reply.time}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReplyTo(reply.authorName);
                                    impact('light');
                                  }}
                                  className="text-sky-600 font-medium hover:underline cursor-pointer"
                                >
                                  Ответить
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </main>

        {/* FULLSCREEN LIGHTBOX MODAL */}
        {isLightboxOpen && postImages.length > 0 && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 backdrop-blur-md animate-fadeIn"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div className="flex items-center justify-between text-white py-2" onClick={(e) => e.stopPropagation()}>
              <span className="text-sm font-semibold text-slate-300">
                Фото {currentImageIdx + 1} из {postImages.length}
              </span>
              <button
                type="button"
                aria-label="Закрыть"
                onClick={() => setIsLightboxOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center relative my-auto" onClick={(e) => e.stopPropagation()}>
              {postImages.length > 1 && (
                <button
                  type="button"
                  aria-label="Предыдущее фото"
                  onClick={() => {
                    setCurrentImageIdx((prev) => (prev > 0 ? prev - 1 : postImages.length - 1));
                    impact('light');
                  }}
                  className="absolute left-2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer z-10"
                >
                  <span className="material-symbols-outlined text-[28px]">chevron_left</span>
                </button>
              )}

              <img
                src={postImages[currentImageIdx]}
                alt={`Фото ${currentImageIdx + 1}`}
                className="max-h-[75vh] max-w-full object-contain rounded-xl select-none shadow-2xl"
              />

              {postImages.length > 1 && (
                <button
                  type="button"
                  aria-label="Следующее фото"
                  onClick={() => {
                    setCurrentImageIdx((prev) => (prev < postImages.length - 1 ? prev + 1 : 0));
                    impact('light');
                  }}
                  className="absolute right-2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer z-10"
                >
                  <span className="material-symbols-outlined text-[28px]">chevron_right</span>
                </button>
              )}
            </div>

            {postImages.length > 1 && (
              <div className="flex items-center justify-center gap-2 py-3 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
                {postImages.map((src, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCurrentImageIdx(idx);
                      impact('light');
                    }}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      currentImageIdx === idx
                        ? 'border-sky-400 scale-105 shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt={`Миниатюра ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <footer className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-40 bg-white/95 backdrop-blur-md border-t border-[#e2e8f0] pb-3 px-3 pt-2">
          {replyTo && (
            <div className="flex items-center justify-between px-2 pb-1 text-xs text-sky-700">
              <span>
                Ответ для: <strong className="font-semibold">{replyTo}</strong>
              </span>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
              >
                Отмена
              </button>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className="flex-1 flex items-center bg-slate-100 rounded-full px-3 py-1.5 border border-transparent focus-within:border-sky-500 focus-within:bg-white transition-all">
              <button
                type="button"
                aria-label="Прикрепить файл"
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full flex items-center justify-center shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">attach_file</span>
              </button>
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                placeholder="Написать комментарий..."
                className="w-full bg-transparent border-0 text-slate-800 placeholder-slate-400 text-sm focus:ring-0 focus:outline-none px-2 py-0"
              />
              <button
                type="button"
                aria-label="Смайлики"
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full flex items-center justify-center shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSendComment}
              aria-label="Отправить"
              className="w-9 h-9 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] ml-0.5">send</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
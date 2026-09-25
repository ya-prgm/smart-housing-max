import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Comment } from '../../../../shared/types/feed';

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    authorName: 'Денис Ломакин',
    avatarText: 'ДЛ',
    avatarBg: 'bg-sky-50 text-sky-700 border-sky-200/60',
    text: 'А когда именно начнут укладывать резиновое покрытие на детской площадке? До майских праздников успеют?',
    time: 'Сегодня в 10:30',
    replies: [
      {
        id: 'c1_1',
        authorName: 'Елена Смирнова',
        roleBadge: 'Председатель',
        avatarText: 'ЕС',
        avatarBg: 'bg-gradient-to-tr from-sky-600 to-sky-400 text-white shadow-sm',
        text: 'Денис, подрядчик выходит на работы с 24 апреля, если не будет затяжных дождей, к 1 мая всё закончат. Смета и график уже в документах дома.',
        time: 'Сегодня в 10:48',
        attachment: {
          type: 'file',
          name: 'График_работ_апрель2025.pdf',
          size: '420 КБ · ТСЖ «Северное»',
        },
      },
      {
        id: 'c1_2',
        authorName: 'Дарья Терехова',
        avatarText: 'ДТ',
        avatarBg: 'bg-rose-50 text-rose-500 border-rose-100',
        text: 'Елена, отлично, спасибо большое! Главное чтобы краской не пахло на праздники 👍',
        time: 'Сегодня в 11:15',
      },
    ],
  },
  {
    id: 'c2',
    authorName: 'Сергей И.',
    avatarText: 'СИ',
    avatarBg: 'bg-slate-100 text-slate-600 border-slate-200',
    text: 'А камеру наблюдения на этот угол тоже смонтируют? В прошлый раз на собрании голосовали за установку.',
    time: 'Сегодня в 11:40',
    attachment: {
      type: 'camera',
      name: 'Схема камеры #3',
      authorLabel: 'Прикреплено жильцом',
    },
  },
  {
    id: 'c3',
    authorName: 'УК «ЖилКомФорт»',
    roleBadge: 'Официально',
    avatarText: 'УК',
    avatarBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    text: 'Михаил, добрый день! Все новые фонари будут со световой температурой 3000K (нейтральный теплый свет), согласовано с проектом.',
    time: 'Сегодня в 11:45',
  },
];

export const PostDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(24);
  const [dislikes, setDislikes] = useState(2);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [commentInput, setCommentInput] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleSendComment = () => {
    if (!commentInput.trim()) return;

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      authorName: 'Александр Смирнов',
      avatarText: 'АС',
      avatarBg: 'bg-sky-100 text-sky-800 border-sky-300',
      text: replyTo ? `${replyTo}, ${commentInput}` : commentInput,
      time: 'Только что',
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentInput('');
    setReplyTo(null);
  };

  return (
    <div className="bg-[#f7f9ff] text-[#141c24] min-h-screen flex flex-col relative select-none">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3 min-w-0">
          <button
            type="button"
            aria-label="Назад"
            onClick={() => navigate('/feed')}
            className="text-slate-800 hover:text-sky-600 transition-colors p-1 -ml-1 rounded-full flex items-center justify-center shrink-0 active:scale-95"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-[17px] font-semibold tracking-tight text-slate-900 leading-tight truncate">
              План весеннего благоустройст...
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-1 shrink-0">
          <button
            type="button"
            aria-label="Опции"
            className="text-slate-500 hover:text-slate-800 p-1.5 rounded-full transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[22px]">more_vert</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-28">
        <article className="bg-white border-b border-slate-200/80 p-4 pt-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full ring-2 ring-[#2aabee] bg-gradient-to-tr from-[#006591] to-[#2aabee] flex items-center justify-center overflow-hidden text-white font-semibold text-sm shadow-sm">
                ЕС
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-semibold text-[14px] text-[#0f172a]">Елена Смирнова</span>
                  <span className="px-2 py-0.5 bg-[#ecf4ff] text-[#006591] text-[10px] font-semibold rounded-full border border-[#c9e6ff]">
                    Председатель
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-[12px] text-[#64748b] mt-0.5">
                  <span>Сегодня в 10:15</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-2 text-[14px] text-[#334155] leading-relaxed">
            <h2 className="font-bold text-[16px] text-[#0f172a] leading-snug">
              План весеннего благоустройства дворовой территории и замена освещения
            </h2>
            <p>
              Уважаемые соседи! Совместно с управляющей компанией «ЖилКомФорт» мы полностью
              согласовали и утвердили план работ на весну 2025 года. На детской площадке заменим
              старое резиновое покрытие, а вдоль аллеи установим новые светодиодные энергосберегающие
              фонари 💡🌿
            </p>
            <p>
              Просим ознакомиться с проектным планом и сметой ниже. Также приглашаем принять
              участие в голосовании по выбору типа ограждения газонов!
            </p>
          </div>

          <div className="mt-3.5">
            <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-[#e6effa] to-[#dae3ef] rounded-2xl overflow-hidden border border-[#dae3ef] flex flex-col justify-between p-3.5 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="bg-[#141c24]/70 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-white tracking-wider">
                  1/4
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center shadow-xs text-[#006591] mb-2">
                  <span className="material-symbols-outlined text-[32px]">yard</span>
                </div>
                <p className="text-[13px] font-medium text-[#141c24]">
                  Визуализация зоны отдыха и детской площадки
                </p>
                <p className="text-[11px] text-[#6e7881]">
                  Корпуса 1, 2 и 3 · План посадки деревьев
                </p>
              </div>
              <div className="flex justify-center items-center space-x-1.5 pb-0.5">
                <span className="w-2.5 h-1.5 rounded-full bg-[#2aabee]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#bec8d2]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#bec8d2]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#bec8d2]"></span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setLikes((l) => l + 1)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-[#ecf4ff] hover:bg-[#c9e6ff] text-[#006591] rounded-full text-[13px] font-semibold transition active:scale-95 border border-[#c9e6ff]"
              >
                <span className="material-symbols-outlined text-[17px]">thumb_up</span>
                <span>{likes}</span>
              </button>
              <button
                type="button"
                onClick={() => setDislikes((d) => d + 1)}
                className="flex items-center space-x-1 px-2.5 py-1.5 bg-[#f7f9ff] hover:bg-[#e6effa] text-[#6e7881] rounded-full text-[13px] font-medium transition active:scale-95 border border-[#dae3ef]"
              >
                <span className="material-symbols-outlined text-[17px]">thumb_down</span>
                <span>{dislikes}</span>
              </button>
            </div>
            <div className="flex items-center space-x-1 text-[#6e7881] text-[13px] font-medium">
              <span className="material-symbols-outlined text-[17px]">visibility</span>
              <span>1,4K</span>
            </div>
          </div>
        </article>

        <section className="px-4 py-3 bg-white mt-2">
          <div className="flex items-center justify-between pb-3 pt-1 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
              КОММЕНТАРИИ ({comments.length + 2})
            </span>
            <button
              type="button"
              className="flex items-center space-x-1 text-sky-600 text-xs font-medium hover:text-sky-700"
            >
              <span>Сначала интересные</span>
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>
          </div>

          <div className="space-y-4 pt-3.5">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                <div className="flex space-x-3 items-start">
                  <div
                    className={`w-9 h-9 rounded-full border shrink-0 flex items-center justify-center text-xs font-semibold ${comment.avatarBg}`}
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

                    {comment.attachment?.type === 'camera' && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-sky-100 bg-sky-50/50 max-w-[220px]">
                        <div className="py-3 px-3 flex flex-col items-center justify-center text-sky-700 text-center">
                          <span className="material-symbols-outlined text-[24px] mb-1 text-sky-600">
                            videocam
                          </span>
                          <span className="text-xs font-semibold text-sky-800">
                            {comment.attachment.name}
                          </span>
                          <span className="text-[10px] text-sky-500">
                            {comment.attachment.authorLabel}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3 mt-1.5 text-xs text-slate-400">
                      <span>{comment.time}</span>
                      <button
                        type="button"
                        onClick={() => setReplyTo(comment.authorName)}
                        className="text-sky-600 font-medium hover:underline"
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
                          className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${reply.avatarBg}`}
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

                          {reply.attachment?.type === 'file' && (
                            <div className="mt-2 flex items-center space-x-2 bg-slate-50 border border-slate-200/80 p-2 rounded-xl max-w-full overflow-hidden">
                              <span className="material-symbols-outlined text-sky-600 text-[20px] shrink-0">
                                description
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-slate-800 truncate">
                                  {reply.attachment.name}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate">
                                  {reply.attachment.size}
                                </p>
                              </div>
                              <button
                                type="button"
                                className="text-sky-600 text-xs font-semibold hover:underline shrink-0"
                              >
                                Открыть
                              </button>
                            </div>
                          )}

                          <div className="flex items-center space-x-3 mt-1.5 text-xs text-slate-400">
                            <span>{reply.time}</span>
                            <button
                              type="button"
                              onClick={() => setReplyTo(reply.authorName)}
                              className="text-sky-600 font-medium hover:underline"
                            >
                              Ответить
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="flex items-center space-x-1 text-sky-600 text-xs font-semibold pt-1 hover:underline"
                    >
                      <span className="material-symbols-outlined text-[16px]">expand_more</span>
                      <span>Показать все ответы (6)</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-40 bg-white/95 backdrop-blur-md border-t border-[#e2e8f0] pb-3 px-3 pt-2">
        {replyTo && (
          <div className="flex items-center justify-between px-2 pb-1 text-xs text-sky-700">
            <span>Ответ для: <strong className="font-semibold">{replyTo}</strong></span>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="text-slate-400 hover:text-slate-600 font-medium"
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
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full flex items-center justify-center shrink-0"
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
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full flex items-center justify-center shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSendComment}
            aria-label="Отправить"
            className="w-9 h-9 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm shrink-0"
          >
            <span className="material-symbols-outlined text-[18px] ml-0.5">send</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
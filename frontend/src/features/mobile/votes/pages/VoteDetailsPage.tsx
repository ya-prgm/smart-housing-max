import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVoteDetail } from '../hooks/useVotes';
import { Skeleton } from '../../../../shared/ui/Skeleton';
import { ErrorState } from '../../../../shared/ui/ErrorState';
import { formatDate } from '../../../../shared/lib/formatDate';

export const VoteDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { poll, isLoading, isError, refetch } = useVoteDetail(id);

  if (isLoading) {
    return (
      <div className="bg-[#f7f9ff] min-h-screen flex flex-col p-4 gap-4">
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !poll) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorState
          title="Опрос не найден"
          message="Не удалось загрузить данные выбранного опроса."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const isCompleted = poll.is_completed_by_me || poll.status === 'completed';

  return (
    <div className="bg-[#f7f9ff] text-slate-900 min-h-screen flex flex-col relative select-none pb-28">
      <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 pt-safe">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Назад"
              onClick={() => navigate('/votes')}
              className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight truncate max-w-[240px]">
              {poll.title}
            </h1>
          </div>
        </div>
      </header>

      {poll.image_url ? (
        <div className="relative w-full h-44 overflow-hidden">
          <img
            src={poll.image_url}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f7f9ff] via-[#f7f9ff]/30 to-transparent" />
        </div>
      ) : (
        <div className="h-4" />
      )}

      <main className="px-4 flex flex-col gap-4 relative z-10 max-w-[430px] mx-auto w-full">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {poll.author?.avatar_url ? (
                <img
                  src={poll.author.avatar_url}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-primary font-bold">
                  {poll.author?.full_name?.charAt(0) || 'А'}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-slate-900 leading-tight">
                  {poll.author?.full_name}
                </span>
                <span className="text-[12px] text-slate-500">
                  {poll.author?.role === 'uk_staff' ? 'Управляющая компания' : 'Совет дома'}
                </span>
              </div>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-sky-50 text-primary'
              }`}
            >
              {isCompleted ? 'Завершен' : 'Активен'}
            </span>
          </div>

          <div>
            <h2 className="text-[17px] font-bold text-slate-900 leading-snug">
              {poll.title}
            </h2>
            <p className="text-[13px] text-slate-600 leading-relaxed mt-1.5 whitespace-pre-line">
              {poll.description}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
              <span className="text-[11px] text-slate-400">Вопросов</span>
              <span className="text-[13px] font-bold text-slate-900 mt-0.5">
                {poll.total_questions || poll.questions?.length || 1}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
              <span className="text-[11px] text-slate-400">Срок завершения</span>
              <span className="text-[13px] font-bold text-slate-900 mt-0.5">
                {poll.deadline ? formatDate(poll.deadline) : 'Бессрочно'}
              </span>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/70 p-4 pb-safe">
        {isCompleted ? (
          <div className="w-full h-12 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[14px] flex items-center justify-center gap-2 border border-emerald-200">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>Вы уже приняли участие</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => navigate(`/votes/${poll.id}/step`)}
            className="w-full h-12 rounded-full text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all bg-primary hover:bg-primary/90 cursor-pointer"
          >
            <span>Приступить к опросу</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVoteDetail } from '../hooks/useVotes';
import { Skeleton } from '../../../../shared/ui/Skeleton';
import { ErrorState } from '../../../../shared/ui/ErrorState';

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

  const isCompleted = poll.is_completed_by_me || poll.status === 'completed' || poll.status === 'archived';
  const isUk = poll.author?.role === 'uk_staff';
  const coverImage = poll.image_url || '/uploads/polls/barrier.jpg';

  return (
    <div className="bg-[#f7f9ff] text-slate-900 min-h-screen flex flex-col relative select-none pb-28">
      <header className="fixed top-0 w-full z-50 bg-[#f7f9ff]/85 backdrop-blur-xl shadow-xs border-b border-slate-200/60 pt-safe">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              aria-label="Назад"
              onClick={() => navigate('/votes')}
              className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-[16px] sm:text-[17px] font-semibold text-slate-900 tracking-tight truncate">
              {poll.title}
            </h1>
          </div>
        </div>
      </header>

      <main className="flex flex-col flex-1 relative w-full pt-14">
        <div className="relative w-full h-44 overflow-hidden bg-slate-200">
          <img
            src={coverImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f7f9ff] via-[#f7f9ff]/40 to-transparent" />
        </div>

        <div className="px-4 -mt-6 flex flex-col gap-4 relative z-10 max-w-lg mx-auto w-full">
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#c9e6ff] flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[22px]">
                    {isUk ? 'corporate_fare' : 'admin_panel_settings'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-slate-900 leading-tight">
                    {poll.author?.name || (isUk ? 'УК «ЖилКомФорт»' : 'Елена Смирнова')}
                  </span>
                  <span className="text-[12px] text-slate-500">
                    {isUk ? 'Управляющая организация' : 'Председатель ТСЖ'}
                  </span>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                  isCompleted
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-[#e0ecf8] text-primary font-semibold'
                }`}
              >
                {isCompleted ? 'Завершён' : 'Активен'}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-[18px] sm:text-[20px] font-bold text-slate-900 leading-snug">
                {poll.title}
              </h2>
              <p className="text-[13px] sm:text-[14px] text-slate-600 leading-relaxed pt-1">
                {poll.description}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-slate-900">Ход голосования</span>
              <span className="text-[12px] font-semibold text-primary">68% кворум</span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden relative">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{ width: '68%' }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-3 rounded-xl bg-[#ecf4ff] flex flex-col gap-0.5">
                <div className="flex items-center gap-1 text-slate-500">
                  <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                  <span className="text-[11px]">Время</span>
                </div>
                <span className="text-[13px] font-bold text-slate-900 mt-0.5">
                  {poll.estimated_time || '~3 мин'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#ecf4ff] flex flex-col gap-0.5">
                <div className="flex items-center gap-1 text-slate-500">
                  <span className="material-symbols-outlined text-[16px] text-primary">fact_check</span>
                  <span className="text-[11px]">Вопросы</span>
                </div>
                <span className="text-[13px] font-bold text-slate-900 mt-0.5">
                  {poll.total_questions || poll.questions?.length || 4} вопр.
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#ecf4ff] flex flex-col gap-0.5">
                <div className="flex items-center gap-1 text-slate-500">
                  <span className="material-symbols-outlined text-[16px] text-primary">event</span>
                  <span className="text-[11px]">Срок</span>
                </div>
                <span className="text-[13px] font-bold text-slate-900 mt-0.5">
                  {poll.deadline_text || 'До 25 мая'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl shadow-lg p-4 pb-safe flex flex-col gap-2 max-w-lg mx-auto w-full border-t border-slate-200/60">
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
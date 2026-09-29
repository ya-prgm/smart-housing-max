import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVotes } from '../hooks/useVotes';
import { Skeleton } from '../../../../shared/ui/Skeleton';
import { EmptyState } from '../../../../shared/ui/EmptyState';
import { formatDate } from '../../../../shared/lib/formatDate';

export const VotesPage: React.FC = () => {
  const navigate = useNavigate();
  const { polls, isLoading } = useVotes();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const filteredPolls = polls.filter((poll) => {
    if (filter === 'pending' && (poll.is_completed || poll.status === 'completed')) return false;
    if (filter === 'completed' && !poll.is_completed && poll.status !== 'completed') return false;
    if (search.trim()) {
      return (
        poll.title.toLowerCase().includes(search.toLowerCase()) ||
        poll.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    return true;
  });

  const completedCount = polls.filter((p) => p.is_completed || p.status === 'completed').length;
  const pendingCount = polls.filter((p) => !p.is_completed && p.status === 'active').length;
  const totalCount = polls.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col w-full relative min-h-screen pb-24">
      <header className="sticky top-0 w-full z-30 pt-safe bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-xs">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[20px]">how_to_vote</span>
            </div>
            <span className="text-[17px] font-bold text-slate-900 tracking-tight">МОЙ ДОМ</span>
          </div>
          <div className="relative">
            <button
              type="button"
              aria-label="Уведомления"
              onClick={() => navigate('/notifications')}
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-600 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 pt-3 flex flex-col gap-3">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по опросам..."
            className="w-full h-11 pl-11 pr-3 bg-white text-slate-900 text-[14px] rounded-xl border border-slate-200/80 shadow-xs placeholder:text-slate-400 focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: `Все (${totalCount})` },
            { id: 'pending', label: `Требуют ответа (${pendingCount})` },
            { id: 'completed', label: `Пройденные (${completedCount})` },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id as typeof filter)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all active:scale-95 ${
                filter === item.id
                  ? 'bg-primary text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between mb-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[22px]">how_to_vote</span>
              </div>
              <div>
                <div className="text-[16px] font-bold text-slate-900 leading-tight">Ваш голос важен</div>
                <p className="text-[12px] text-slate-500">
                  Пройдено {completedCount} из {totalCount} опросов дома
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-sky-100 text-primary text-[11px] font-bold">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <main className="px-4 pt-3 flex flex-col gap-3.5">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-44 w-full rounded-[22px]" />
            <Skeleton className="h-44 w-full rounded-[22px]" />
          </div>
        ) : filteredPolls.length === 0 ? (
          <EmptyState
            title="Опросы не найдены"
            description="На данный момент нет опросов, соответствующих выбранным критериям"
            icon="how_to_vote"
          />
        ) : (
          filteredPolls.map((poll) => {
            const isCompleted = poll.is_completed || poll.status === 'completed';

            return (
              <article
                key={poll.id}
                onClick={() => navigate(`/votes/${poll.id}`)}
                className="bg-white p-4 sm:p-5 rounded-[22px] border border-slate-100 shadow-card flex flex-col gap-3 transition-all cursor-pointer active:scale-[0.99] hover:border-slate-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-primary text-[14px]">
                      <span className="material-symbols-outlined text-[15px]">
                        {poll.author?.role === 'uk_staff' ? 'corporate_fare' : 'shield_person'}
                      </span>
                    </div>
                    <span className="text-[13px] text-slate-900 font-semibold">
                      {poll.author?.full_name || 'Совет дома'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isCompleted ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span>
                        Пройдено
                      </span>
                    ) : (
                      <>
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[11px] font-medium border border-rose-100">
                          Не пройден
                        </span>
                        {poll.deadline && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[13px]">alarm</span>
                            {formatDate(poll.deadline)}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-[15px] font-bold text-slate-900 leading-snug">{poll.title}</h2>
                  <p className="text-[13px] text-slate-600 mt-1 leading-relaxed line-clamp-2">
                    {poll.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-medium text-slate-600">
                    <span className="material-symbols-outlined text-[14px]">quiz</span>
                    {poll.questions_count} вопр.
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-100 text-[11px] font-medium text-primary">
                    <span className="material-symbols-outlined text-[14px]">group</span>
                    {poll.participants_count} уч.
                  </span>
                </div>

                {!isCompleted && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/votes/${poll.id}`);
                    }}
                    className="w-full h-11 bg-primary text-white rounded-full font-semibold text-[14px] flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all hover:bg-primary/90 mt-1 cursor-pointer"
                  >
                    <span>Пройти опрос</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                )}
              </article>
            );
          })
        )}
      </main>
    </div>
  );
};
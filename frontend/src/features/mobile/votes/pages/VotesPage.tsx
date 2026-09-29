import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVotes } from '../hooks/useVotes';
import { Skeleton } from '../../../../shared/ui/Skeleton';
import { EmptyState } from '../../../../shared/ui/EmptyState';

export const VotesPage: React.FC = () => {
  const navigate = useNavigate();
  const { polls, isLoading } = useVotes();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'archived'>('all');
  const [search, setSearch] = useState('');

  const filteredPolls = polls.filter((poll) => {
    const isCompleted = poll.is_completed;
    const isArchived = poll.status === 'completed' || poll.status === 'archived';

    if (filter === 'pending' && (isCompleted || isArchived)) return false;
    if (filter === 'completed' && !isCompleted) return false;
    if (filter === 'archived' && !isArchived) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        poll.title.toLowerCase().includes(q) ||
        poll.description.toLowerCase().includes(q) ||
        (poll.author?.name && poll.author.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const activePolls = polls.filter((p) => p.status !== 'completed' && p.status !== 'archived');
  const completedCount = polls.filter((p) => p.is_completed).length;
  const pendingCount = activePolls.filter((p) => !p.is_completed).length;
  const archivedCount = polls.filter((p) => p.status === 'completed' || p.status === 'archived').length;
  const totalCount = polls.length;

  const totalActive = Math.max(1, activePolls.length);
  const progressPercent = Math.min(100, Math.round((completedCount / totalActive) * 100));

  return (
    <div className="flex flex-col w-full relative min-h-screen pb-24 bg-[#f7f9ff] text-slate-900 select-none">
      <header className="sticky top-0 w-full z-40 pt-safe bg-[#f7f9ff]/85 backdrop-blur-xl border-b border-slate-200/70 shadow-xs">
        <div className="h-14 px-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#ecf4ff] flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[22px]">apartment</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[17px] font-bold text-slate-900 tracking-tight truncate leading-none">
                МОЙ ДОМ
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              aria-label="Уведомления"
              onClick={() => navigate('/notifications')}
              className="relative w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#f7f9ff]" />
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 pt-3 flex flex-col gap-2.5">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по опросам..."
            className="w-full h-11 pl-11 pr-9 bg-white text-slate-900 text-[14px] rounded-xl border border-slate-200 shadow-xs placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-[#ecf4ff]/30 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: `Все (${totalCount})` },
            { id: 'pending', label: `Требуют ответа (${pendingCount})` },
            { id: 'completed', label: `Пройденные (${completedCount})` },
            { id: 'archived', label: `Архив (${archivedCount})` },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id as typeof filter)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all active:scale-95 cursor-pointer ${
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

      <div className="px-4 pt-3">
        <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-start justify-between gap-3 mb-2.5 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c9e6ff] flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[22px]">how_to_vote</span>
              </div>
              <div>
                <div className="text-[16px] font-bold text-slate-900 leading-tight">
                  Ваш голос важен
                </div>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Пройдено {completedCount} из {activePolls.length} актуальных опросов
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#d9e2ff] text-primary text-[11px] font-bold shrink-0">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex gap-1 p-0.5">
            {activePolls.map((p, idx) => (
              <div
                key={p.id || idx}
                className={`h-full flex-1 rounded-full transition-all duration-500 ${
                  p.is_completed ? 'bg-primary' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <main className="px-4 pt-3 flex flex-col gap-3.5">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-44 w-full rounded-[20px]" />
            <Skeleton className="h-44 w-full rounded-[20px]" />
          </div>
        ) : filteredPolls.length === 0 ? (
          <EmptyState
            title="Опросы не найдены"
            description="Нет опросов, соответствующих выбранным критериям поиска"
            icon="how_to_vote"
          />
        ) : (
          filteredPolls.map((poll) => {
            const isCompleted = poll.is_completed;
            const isArchived = poll.status === 'completed' || poll.status === 'archived';
            const isUk = poll.author?.role === 'uk_staff';

            return (
              <article
                key={poll.id}
                onClick={() => navigate(`/votes/${poll.id}`)}
                className={`bg-white p-4 sm:p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col gap-3 transition-all cursor-pointer active:scale-[0.99] hover:border-slate-200 ${
                  isArchived ? 'opacity-90' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#ecf4ff] flex items-center justify-center text-primary text-[14px]">
                      <span className="material-symbols-outlined text-[16px]">
                        {isUk ? 'corporate_fare' : 'shield_person'}
                      </span>
                    </div>
                    <span className="text-[13px] text-slate-800 font-semibold">
                      {poll.author?.name || (isUk ? 'УК «ЖилКомФорт»' : 'Председатель ТСЖ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isCompleted ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span>
                        Пройдено вами
                      </span>
                    ) : isArchived ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                        Завершён
                      </span>
                    ) : (
                      <>
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[11px] font-medium border border-rose-100">
                          Не пройден
                        </span>
                        {poll.deadline_text && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[13px]">alarm</span>
                            {poll.deadline_text}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-[15px] sm:text-[16px] font-bold text-slate-900 leading-snug">
                    {poll.title}
                  </h2>
                  <p className="text-[13px] text-slate-600 mt-1 leading-relaxed line-clamp-2">
                    {poll.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {poll.estimated_time && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-medium text-slate-600">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {poll.estimated_time}
                    </span>
                  )}
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-medium text-slate-600">
                    <span className="material-symbols-outlined text-[14px]">quiz</span>
                    {poll.questions_count} {poll.questions_count === 1 ? 'вопрос' : poll.questions_count < 5 ? 'вопроса' : 'вопросов'}
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#c9e6ff] text-[11px] font-medium text-primary">
                    <span className="material-symbols-outlined text-[14px]">group</span>
                    {poll.participants_count} {poll.participants_count % 10 === 1 && poll.participants_count % 100 !== 11 ? 'жилец' : poll.participants_count % 10 >= 2 && poll.participants_count % 10 <= 4 && (poll.participants_count % 100 < 10 || poll.participants_count % 100 >= 20) ? 'жильца' : 'жильцов'}
                  </span>
                </div>

                {!isCompleted && !isArchived && (
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
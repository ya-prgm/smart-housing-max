import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useVotes } from '../../mobile/votes/hooks/useVotes';

export const ChairmanPollsPage: React.FC = () => {
  const navigate = useNavigate();
  const { polls, isLoading } = useVotes();

  const activePolls = polls.filter((p) => p.status === 'active');
  const completedPolls = polls.filter((p) => p.status === 'completed' || p.status === 'archived');

  const [filter, setFilter] = React.useState<'all' | 'active' | 'completed'>('all');

  const filteredPolls = filter === 'all' ? polls : filter === 'active' ? activePolls : completedPolls;

  return (
    <div className="flex flex-col w-full min-h-screen pb-28 bg-[#f7f9ff] text-slate-900 select-none">
      {/* Header */}
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

      <div className="px-4 pt-3 flex flex-col gap-3">
        {/* Search */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
          <input
            type="text"
            placeholder="Поиск по опросам..."
            className="w-full h-11 pl-11 pr-4 bg-white text-slate-900 text-[14px] rounded-xl border border-slate-200 shadow-xs placeholder:text-slate-400 focus:outline-none focus:border-primary transition-all"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all' as const, label: `Все (${polls.length})` },
            { id: 'active' as const, label: `Активные (${activePolls.length})` },
            { id: 'completed' as const, label: `Завершённые (${completedPolls.length})` },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all active:scale-95 cursor-pointer ${
                filter === item.id
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <main className="px-4 pt-3 flex flex-col gap-3.5 pb-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-52 bg-white rounded-[20px] animate-pulse" />
            ))}
          </div>
        ) : filteredPolls.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <span className="material-symbols-outlined text-[56px] mb-3">how_to_vote</span>
            <p className="text-[15px] font-medium">Опросов не найдено</p>
          </div>
        ) : (
          filteredPolls.map((poll) => {
            const isActive = poll.status === 'active';
            const isArchived = poll.status === 'completed' || poll.status === 'archived';
            const isUk = poll.author?.role === 'uk_staff';

            return (
              <article
                key={poll.id}
                className="bg-white p-4 sm:p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col gap-3"
              >
                {/* Author & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#ecf4ff] flex items-center justify-center text-primary text-[14px]">
                      <span className="material-symbols-outlined text-[16px]">
                        {isUk ? 'corporate_fare' : 'shield_person'}
                      </span>
                    </div>
                    <span className="text-[13px] text-slate-800 font-semibold">
                      {isUk ? 'УК «ЖилКомФорт»' : 'Председатель ТСЖ'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isActive ? 'Активен' : 'Завершён'}
                    </span>
                    {isActive && poll.deadline_text && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">alarm</span>
                        {poll.deadline_text}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h2 className="text-[15px] font-bold text-slate-900 leading-snug">{poll.title}</h2>
                  <p className="text-[13px] text-slate-600 mt-1 leading-relaxed line-clamp-2">{poll.description}</p>
                </div>

                {/* Stats row */}
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
                    {poll.participants_count} жильцов
                  </span>
                </div>

                {/* Chairman action — View results, NOT take poll */}
                {isArchived && (
                  <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-3 py-2 mt-0.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                    <span className="text-[12px] text-emerald-700 font-medium">
                      {poll.participants_count} участников приняли участие • Решение принято
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => navigate(`/chairman/polls/${poll.id}/results`)}
                  className="w-full h-11 bg-primary text-white rounded-full font-semibold text-[14px] flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all hover:bg-primary/90 mt-1 cursor-pointer"
                >
                  <span>{isActive ? 'Смотреть динамику' : 'Посмотреть результаты'}</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                {/* Push reminder for active polls */}
                {isActive && (
                  <div className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-slate-500">notifications_active</span>
                      <div>
                        <span className="text-[12px] text-slate-700 font-medium">Push-напоминание</span>
                        <div className="text-[10px] text-slate-400">
                          {Math.max(0, 184 - poll.participants_count)} жильцов ещё не ответили
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-primary text-white text-[11px] font-semibold cursor-pointer active:scale-95 transition-transform"
                    >
                      Отправить
                    </button>
                  </div>
                )}
              </article>
            );
          })
        )}
      </main>

      {/* FAB: New Poll */}
      <button
        type="button"
        onClick={() => navigate('/chairman/create-poll')}
        className="fixed bottom-24 right-4 max-w-[430px] flex items-center gap-2 px-5 py-3.5 bg-primary text-white rounded-full font-bold text-[14px] shadow-xl active:scale-95 transition-transform cursor-pointer z-30"
        style={{ boxShadow: '0 6px 20px rgba(0,86,196,0.35)' }}
      >
        <span className="material-symbols-outlined text-[20px]">add</span>
        Новый опрос
      </button>
    </div>
  );
};

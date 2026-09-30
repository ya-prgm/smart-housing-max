import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVotes } from '../../mobile/votes/hooks/useVotes';
import { APP_LOGO_SRC } from '../../../shared/constants/branding';
import { useUnreadNotifications } from '../../../shared/hooks/useUnreadNotifications';

export const ChairmanPollsPage: React.FC = () => {
  const navigate = useNavigate();
  const { polls, isLoading } = useVotes();
  const { hasUnread } = useUnreadNotifications();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const activePolls = polls.filter((p) => p.status === 'active');
  const completedPolls = polls.filter((p) => p.status === 'completed' || p.status === 'archived');

  const baseList = filter === 'all' ? polls : filter === 'active' ? activePolls : completedPolls;
  const filteredPolls = baseList.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col w-full min-h-screen pb-28 bg-[#f8fafc] text-slate-900 select-none">
      <header className="sticky top-0 z-40 pt-safe bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-xs">
        <div className="h-14 px-4 flex items-center justify-between gap-3">
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
            className="w-full h-11 pl-11 pr-4 bg-white text-slate-900 text-[14px] rounded-2xl border border-slate-200/80 shadow-xs placeholder:text-slate-400 focus:outline-none focus:border-primary transition-all"
          />
        </div>

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
              <div key={i} className="h-52 bg-white rounded-3xl animate-pulse border border-slate-200/80" />
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
                className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card flex flex-col gap-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-primary text-[14px]">
                      <span className="material-symbols-outlined text-[16px]">
                        {isUk ? 'corporate_fare' : 'shield_person'}
                      </span>
                    </div>
                    <span className="text-[13px] text-slate-800 font-semibold">
                      {isUk ? 'УК «ЖилКомФорт»' : 'Председатель ТСЖ'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
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

                <div>
                  <h2 className="text-[15px] font-bold text-slate-900 leading-snug">{poll.title}</h2>
                  <p className="text-[13px] text-slate-600 mt-1 leading-relaxed line-clamp-2">
                    {poll.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {poll.estimated_time && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-[11px] font-medium text-slate-600">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {poll.estimated_time}
                    </span>
                  )}
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-[11px] font-medium text-slate-600">
                    <span className="material-symbols-outlined text-[14px]">quiz</span>
                    {poll.questions_count}{' '}
                    {poll.questions_count === 1
                      ? 'вопрос'
                      : poll.questions_count < 5
                      ? 'вопроса'
                      : 'вопросов'}
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-50 text-[11px] font-medium text-primary">
                    <span className="material-symbols-outlined text-[14px]">group</span>
                    {poll.participants_count} жильцов
                  </span>
                </div>

                {isArchived && (
                  <div className="flex items-center gap-2 bg-emerald-50 rounded-2xl px-3.5 py-2.5 mt-0.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">
                      check_circle
                    </span>
                    <span className="text-[12px] text-emerald-700 font-medium">
                      {poll.participants_count} участников приняли участие
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => navigate(`/chairman/polls/${poll.id}/results`)}
                  className="w-full h-11 bg-primary hover:bg-[#00557a] text-white rounded-2xl font-semibold text-[14px] flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all mt-1 cursor-pointer"
                >
                  <span>Смотреть результаты</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                {isActive && (
                  <div className="flex items-center justify-between bg-slate-50 rounded-2xl px-3.5 py-2.5 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-slate-500">
                        notifications_active
                      </span>
                      <div>
                        <span className="text-[12px] text-slate-700 font-medium">
                          Push-напоминание
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {Math.max(0, 184 - poll.participants_count)} жильцов ещё не ответили
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-[#00557a] text-white text-[11px] font-semibold cursor-pointer active:scale-95 transition-all"
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

      <button
        type="button"
        onClick={() => navigate('/chairman/create-poll')}
        className="fixed bottom-24 right-4 max-w-[430px] flex items-center gap-2 px-5 py-3.5 bg-primary hover:bg-[#00557a] text-white rounded-full font-bold text-[14px] shadow-card active:scale-95 transition-all cursor-pointer z-30"
      >
        <span className="material-symbols-outlined text-[20px]">add</span>
        Новый опрос
      </button>
    </div>
  );
};

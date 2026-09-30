import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '../../../../shared/types/ticket';
import { SupportModal } from '../components/SupportModal';
import { useTickets } from '../hooks/useTickets';
import { useHaptic } from '../../../../shared/hooks/useHaptic';
import { APP_LOGO_SRC } from '../../../../shared/constants/branding';
import { useUnreadNotifications } from '../../../../shared/hooks/useUnreadNotifications';

export const TicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const { impact } = useHaptic();
  const { hasUnread } = useUnreadNotifications();
  const [filter, setFilter] = useState<'all' | 'my' | 'active' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const { tickets, isLoading, toggleSupport } = useTickets(
    filter === 'my' ? undefined : filter,
    filter === 'my',
    searchQuery
  );

  const handleVoteClick = async (ticket: Ticket, e: React.MouseEvent) => {
    e.stopPropagation();
    if (ticket.isMy) return;
    impact('light');
    if (ticket.isVoted) {
      try {
        await toggleSupport(ticket.id);
      } catch {}
    } else {
      setSelectedTicket(ticket);
    }
  };

  const handleConfirmVote = async () => {
    if (!selectedTicket || selectedTicket.isMy) return;
    impact('medium');
    try {
      await toggleSupport(selectedTicket.id);
    } catch {}
    setSelectedTicket(null);
  };

  return (
    <div className="flex flex-col w-full relative min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 w-full z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all">
        <div className="px-4 pt-2.5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={APP_LOGO_SRC}
              alt="Логотип Мой Дом"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                if (target.nextElementSibling) {
                  (target.nextElementSibling as HTMLElement).style.display = 'flex';
                }
              }}
              className="w-8 h-8 rounded-full object-contain bg-white shadow-xs border border-slate-200/80 shrink-0"
            />
            <div className="w-8 h-8 rounded-full bg-[#006591] hidden items-center justify-center text-white shrink-0 shadow-xs font-bold text-xs tracking-wider">
              МД
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
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white pointer-events-none" />
            )}
          </div>
        </div>
      </header>

      <div className="px-4 pt-3 flex flex-col gap-3">
        <div className="relative w-full">
          <div className="flex items-center w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs px-3.5 py-2.5 transition-all focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100">
            <span className="material-symbols-outlined text-slate-400 text-[20px] mr-2.5 shrink-0 select-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по обращениям..."
              className="w-full bg-transparent text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="button"
              aria-label="Параметры фильтрации"
              className="text-slate-400 hover:text-slate-700 flex items-center shrink-0 ml-1"
            >
              <span className="material-symbols-outlined text-[19px]">tune</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 py-0.5">
          {[
            { id: 'all', label: 'Все' },
            { id: 'my', label: 'Мои' },
            { id: 'active', label: 'Активные' },
            { id: 'in_progress', label: 'В работе' },
            { id: 'completed', label: 'Выполнено' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide transition-all active:scale-95 ${
                filter === tab.id
                  ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/10'
                  : 'border border-slate-200/80 bg-white text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="px-4 pt-3.5 pb-28 flex-1">
        {isLoading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Загрузка обращений...</div>
        ) : tickets.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 items-start" id="tickets-grid">
            {tickets.map((ticket) => (
              <article
                key={ticket.id}
                onClick={() => {
                  impact('light');
                  navigate(`/tickets/${ticket.id}`);
                }}
                className={`ticket-card flex flex-col justify-between rounded-2xl p-3.5 border shadow-card transition-all active:scale-[0.98] cursor-pointer ${
                  ticket.isMy && ticket.status !== 'completed'
                    ? 'bg-sky-50/40 border-sky-200/90'
                    : 'bg-white border-slate-200/85'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold truncate">
                      {ticket.category}
                    </span>
                    {ticket.isMy && (
                      <span className="px-1.5 py-0.2 rounded bg-sky-500 text-white text-[10px] font-bold">
                        Моё
                      </span>
                    )}
                    {ticket.status === 'completed' && (
                      <span className="material-symbols-outlined text-emerald-600 text-[17px] shrink-0">
                        check_circle
                      </span>
                    )}
                  </div>
                  <h2 className="text-[14px] font-bold text-slate-900 leading-snug mb-1">
                    {ticket.title}
                  </h2>
                  <p className="text-[12px] text-slate-600 leading-relaxed line-clamp-3 mb-2.5 font-normal">
                    {ticket.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    {ticket.status === 'in_progress' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        В работе
                      </span>
                    )}
                    {ticket.status === 'active' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        Активно
                      </span>
                    )}
                    {ticket.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                        <span className="material-symbols-outlined text-[13px]">done</span>
                        Выполнено
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 truncate">{ticket.date}</span>
                  </div>

                  {ticket.status === 'completed' ? (
                    <div className="w-full py-1.5 px-2.5 rounded-full bg-slate-50 text-slate-500 text-[11px] font-medium text-center border border-slate-100 truncate">
                      {ticket.resolvedLabel || `Решено УК • ${ticket.votesCount} чел`}
                    </div>
                  ) : ticket.isMy ? (
                    <div className="w-full py-1.5 px-2 rounded-full bg-sky-50/80 border border-sky-200/80 text-sky-700 text-[11px] font-semibold text-center flex items-center justify-center gap-1 truncate">
                      <span className="material-symbols-outlined text-[14px]">person</span>
                      <span className="truncate">Ваше • {ticket.votesCount}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleVoteClick(ticket, e)}
                      className={`vote-action w-full py-1.5 px-2 rounded-full text-[11px] flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer ${
                        ticket.isVoted
                          ? 'bg-sky-100 border border-sky-200 text-sky-800 font-semibold'
                          : 'bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 font-medium'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px] text-primary">
                        {ticket.isVoted ? 'check' : 'group_add'}
                      </span>
                      <span className="vote-num font-semibold truncate">
                        {ticket.isVoted
                          ? `Вы поддержали (${ticket.votesCount})`
                          : `У меня тоже (${ticket.votesCount})`}
                      </span>
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center" id="empty-state">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
              <span className="material-symbols-outlined text-[28px]">search_off</span>
            </div>
            <h3 className="text-[16px] font-bold text-slate-900 mb-1">Ничего не найдено</h3>
            <p className="text-[13px] text-slate-500 max-w-[240px]">
              Попробуйте скорректировать поисковый запрос или фильтр
            </p>
          </div>
        )}
      </main>

      <div className="fixed bottom-20 max-w-[430px] w-full flex justify-end px-4 pointer-events-none z-40">
        <button
          type="button"
          id="new-ticket-fab"
          onClick={() => {
            impact('medium');
            navigate('/tickets/new');
          }}
          className="pointer-events-auto flex items-center gap-2 bg-[#006591] hover:bg-[#005073] text-white pl-4 pr-5 h-12 rounded-full shadow-float active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">add</span>
          <span className="text-[14px] font-semibold tracking-wide">Новое обращение</span>
        </button>
      </div>

      <SupportModal
        isOpen={!!selectedTicket}
        ticketTitle={selectedTicket?.title || ''}
        ticketCode={selectedTicket?.code || ''}
        category={selectedTicket?.category}
        currentVotes={selectedTicket?.votesCount || 0}
        onClose={() => setSelectedTicket(null)}
        onConfirm={handleConfirmVote}
      />
    </div>
  );
};
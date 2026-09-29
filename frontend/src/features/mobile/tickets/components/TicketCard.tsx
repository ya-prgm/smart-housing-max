import React from 'react';
import { Ticket } from '../../../../shared/types/ticket';

export interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
  onVoteClick?: (e: React.MouseEvent) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick, onVoteClick }) => {
  const getStatusBadge = () => {
    switch (ticket.status) {
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            В работе
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="material-symbols-outlined text-[13px]">check</span>
            Выполнено
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-[#0088cc] border border-sky-100">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0088cc]" />
            Новая
          </span>
        );
    }
  };

  return (
    <article
      onClick={onClick}
      className={`p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between transition-all active:scale-[0.99] cursor-pointer hover:shadow-md ${
        ticket.isMy ? 'ring-1 ring-[#0088cc]/20' : ''
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-bold text-slate-400">{ticket.code}</span>
            {ticket.isMy && (
              <span className="px-1.5 py-0.5 rounded bg-sky-50 text-[#0088cc] text-[10px] font-bold">
                Моё
              </span>
            )}
          </div>
          {getStatusBadge()}
        </div>

        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mb-1.5">
          {ticket.title}
        </h3>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
          {ticket.description}
        </p>
      </div>

      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <span className="text-slate-400">{ticket.date}</span>

        {ticket.isMy ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold bg-sky-50 text-[#0088cc] border border-sky-200/80">
            <span className="material-symbols-outlined text-[15px]">person</span>
            <span>{ticket.votesCount}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onVoteClick}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition active:scale-95 cursor-pointer ${
              ticket.isVoted
                ? 'bg-[#0088cc] text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {ticket.isVoted ? 'check' : 'thumb_up'}
            </span>
            <span>{ticket.votesCount}</span>
          </button>
        )}
      </div>
    </article>
  );
};

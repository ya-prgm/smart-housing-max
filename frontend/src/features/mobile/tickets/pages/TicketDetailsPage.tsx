import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTicketDetails } from '../hooks/useTickets';
import { useHaptic } from '../../../../shared/hooks/useHaptic';

export const TicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ticketId = id || '1';
  const { ticket, isLoading, isError, toggleSupport } = useTicketDetails(ticketId);
  const { impact, notification } = useHaptic();

  const handleSupport = async () => {
    impact('medium');
    try {
      await toggleSupport();
      notification('success');
    } catch {
      notification('error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Заявка не найдена</h2>
        <button
          type="button"
          onClick={() => navigate('/tickets')}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative pb-28 select-none">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            aria-label="Назад"
            onClick={() => navigate('/tickets')}
            className="p-1 -ml-1 text-slate-800 hover:text-sky-600 transition-colors rounded-full"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <span className="font-mono text-sm font-bold text-slate-500">{ticket.code}</span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            ticket.status === 'completed'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : ticket.status === 'in_progress'
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-sky-50 text-[#0088cc] border border-sky-200'
          }`}
        >
          {ticket.status === 'completed'
            ? 'Выполнена'
            : ticket.status === 'in_progress'
            ? 'В работе'
            : 'Новая'}
        </span>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full flex flex-col gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            <span>{ticket.house_address}</span>
            <span>•</span>
            <span>{new Date(ticket.created_at).toLocaleDateString('ru-RU')}</span>
          </div>

          <span className="inline-flex self-start px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            {ticket.category || ticket.topic_title}
          </span>

          <h1 className="text-lg font-bold text-slate-900 leading-snug">{ticket.title}</h1>

          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {ticket.description}
          </p>

          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-400">Прикрепленные файлы:</span>
              <div className="flex flex-wrap gap-2">
                {ticket.attachments.map((att) => (
                  <a
                    key={att.id}
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    <span className="material-symbols-outlined text-[16px]">attach_file</span>
                    <span>{att.filename}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {ticket.recipients && ticket.recipients.length > 0 && (
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-900">Адресаты обращения</h3>
            <div className="flex flex-col gap-2">
              {ticket.recipients.map((r) => (
                <div key={r.id} className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    {r.icon || 'domain'}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-800">{r.short_name}</span>
                    <span className="text-[11px] text-slate-400">{r.full_name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Поддержали обращение</span>
            <span className="text-base font-bold text-slate-900">
              {ticket.votes_count} {ticket.votes_count === 1 ? 'сосед' : 'соседей'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSupport}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 cursor-pointer shadow-sm ${
              ticket.is_voted
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-[#0088cc] hover:bg-sky-600 text-white shadow-sky-600/30'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {ticket.is_voted ? 'check' : 'thumb_up'}
            </span>
            <span>{ticket.is_voted ? 'У меня тоже (учтено)' : 'У меня тоже!'}</span>
          </button>
        </div>
      </main>
    </div>
  );
};

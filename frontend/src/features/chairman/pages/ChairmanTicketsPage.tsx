import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api/client';
import { useToast } from '../../../shared/hooks/useToast';
import type { TicketResponseItem } from '../../mobile/tickets/api';

const STATUS_LABELS: Record<string, string> = {
  active: 'Активно',
  in_progress: 'В работе',
  completed: 'Выполнено',
  rejected: 'Отклонено',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-cyan-50 text-cyan-700 border-cyan-100',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-100',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  rejected: 'bg-red-50 text-red-700 border-red-100',
};

const STATUS_ICONS: Record<string, string> = {
  active: 'fiber_new',
  in_progress: 'engineering',
  completed: 'check_circle',
  rejected: 'cancel',
};

export const ChairmanTicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Reply modal
  const [replyTicketId, setReplyTicketId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyStatus, setReplyStatus] = useState<string>('');
  const [isSending, setIsSending] = useState(false);

  // Fetch raw TicketResponseItem[] (not mapped to Ticket)
  const { data: tickets = [], isLoading } = useQuery<TicketResponseItem[]>({
    queryKey: ['chairman-tickets'],
    queryFn: async () => {
      const { data } = await apiClient.get<TicketResponseItem[]>('/tickets');
      return data;
    },
  });

  const filtered = tickets.filter((t) => {
    if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.code?.toLowerCase().includes(q) ||
        t.author_full_name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts = {
    all: tickets.length,
    active: tickets.filter((t) => t.status === 'active').length,
    in_progress: tickets.filter((t) => t.status === 'in_progress').length,
    completed: tickets.filter((t) => t.status === 'completed').length,
  };

  const handleSendReply = async () => {
    if (!replyTicketId || !replyContent.trim()) return;
    setIsSending(true);
    try {
      await apiClient.post(`/tickets/${replyTicketId}/reply`, {
        content: replyContent.trim(),
        new_status: replyStatus || null,
      });
      showToast('Ответ успешно отправлен жильцу', 'success');
      setReplyTicketId(null);
      setReplyContent('');
      setReplyStatus('');
      queryClient.invalidateQueries({ queryKey: ['chairman-tickets'] });
    } catch {
      showToast('Не удалось отправить ответ', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen pb-28 bg-[#f0f4ff] text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 pt-safe bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-sm">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-indigo-600">inbox</span>
            </div>
            <span className="text-[17px] font-bold text-slate-900">Обращения жильцов</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
            {tickets.length} всего
          </span>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по номеру, теме, жильцу..."
              className="w-full h-10 pl-10 pr-4 bg-slate-100 text-sm rounded-xl placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-300 transition-all"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: `Все (${counts.all})` },
            { id: 'active', label: `Новые (${counts.active})` },
            { id: 'in_progress', label: `В работе (${counts.in_progress})` },
            { id: 'completed', label: `Закрыты (${counts.completed})` },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedStatus(item.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                selectedStatus === item.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Ticket List */}
      <main className="px-4 pt-3 flex flex-col gap-3">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <span className="material-symbols-outlined text-[56px] mb-3">inbox</span>
            <p className="text-[15px] font-medium">Обращений не найдено</p>
          </div>
        ) : (
          filtered.map((ticket) => (
            <article
              key={ticket.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3"
            >
              {/* Ticket Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px] text-slate-600">
                      {STATUS_ICONS[ticket.status] || 'article'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-indigo-600">{ticket.code}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_COLORS[ticket.status]}`}>
                        {STATUS_LABELS[ticket.status]}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug line-clamp-1">
                      {ticket.title}
                    </h3>
                    {ticket.author_full_name && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[13px] text-slate-400">person</span>
                        <span className="text-[11px] text-slate-500">{ticket.author_full_name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 pt-1">
                  {new Date(ticket.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                </span>
              </div>

              {/* Description */}
              <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2">
                {ticket.description}
              </p>

              {/* Existing replies indicator */}
              {ticket.replies && ticket.replies.length > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 rounded-xl">
                  <span className="material-symbols-outlined text-[14px] text-emerald-600">mark_chat_read</span>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    {ticket.replies.length === 1 ? '1 ответ отправлен' : `${ticket.replies.length} ответа отправлено`}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  className="flex-1 h-9 rounded-xl bg-slate-100 text-slate-700 text-[12px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  Детали
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReplyTicketId(ticket.id);
                    setReplyContent('');
                    setReplyStatus('');
                  }}
                  className="flex-1 h-9 rounded-xl bg-indigo-600 text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">reply</span>
                  Ответить
                </button>
              </div>
            </article>
          ))
        )}
      </main>

      {/* Reply Modal */}
      {replyTicketId !== null && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => !isSending && setReplyTicketId(null)} />
          <div className="relative z-10 w-full max-w-[430px] mx-auto bg-white rounded-t-3xl px-5 pt-4 pb-8 shadow-2xl flex flex-col gap-4">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-1" />
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-indigo-600">reply</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Ответить на обращение</h3>
                <p className="text-xs text-slate-500">Жилец получит уведомление</p>
              </div>
            </div>

            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Напишите ответ жильцу..."
              rows={4}
              className="w-full p-3.5 bg-slate-50 rounded-xl text-sm text-slate-900 border border-slate-200 resize-none focus:outline-none focus:border-indigo-400 focus:bg-white transition-colors"
            />

            {/* Change status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Изменить статус (необязательно)</label>
              <div className="flex gap-2 flex-wrap">
                {['', 'in_progress', 'completed', 'rejected'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setReplyStatus(s)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                      replyStatus === s
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {s === '' ? 'Не менять' : STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => setReplyTicketId(null)}
                disabled={isSending}
                className="flex-1 h-11 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm cursor-pointer active:scale-[0.98] transition-transform"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleSendReply}
                disabled={isSending || !replyContent.trim()}
                className="flex-1 h-11 rounded-xl bg-indigo-600 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform shadow disabled:opacity-50"
              >
                {isSending ? (
                  <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    Отправить
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

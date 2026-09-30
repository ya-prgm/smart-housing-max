import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api/client';
import { useToast } from '../../../shared/hooks/useToast';
import { APP_LOGO_SRC } from '../../../shared/constants/branding';
import { useUnreadNotifications } from '../../../shared/hooks/useUnreadNotifications';
import type { TicketResponseItem } from '../../mobile/tickets/api';

const STATUS_LABELS: Record<string, string> = {
  active: 'Новое',
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
  const { hasUnread } = useUnreadNotifications();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const [replyTicketId, setReplyTicketId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyStatus, setReplyStatus] = useState<string>('');
  const [isSending, setIsSending] = useState(false);

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

        <div className="px-4 pb-2.5 pt-1">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по номеру, теме, жильцу..."
              className="w-full h-11 pl-10 pr-4 bg-white text-slate-900 text-sm rounded-2xl border border-slate-200/80 shadow-xs placeholder:text-slate-400 focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

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
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all active:scale-95 cursor-pointer ${
                selectedStatus === item.id
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 pt-3 flex flex-col gap-3.5">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 bg-white rounded-3xl animate-pulse border border-slate-200/80" />
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
              className="bg-white rounded-3xl p-5 shadow-card border border-slate-200/80 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      {STATUS_ICONS[ticket.status] || 'article'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-primary">{ticket.code}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_COLORS[ticket.status]}`}
                      >
                        {STATUS_LABELS[ticket.status]}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug line-clamp-1">
                      {ticket.title}
                    </h3>
                    {ticket.author_full_name && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[14px] text-slate-400">
                          person
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {ticket.author_full_name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0 font-medium pt-0.5">
                  {new Date(ticket.created_at).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>

              <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2">
                {ticket.description}
              </p>

              {ticket.replies && ticket.replies.length > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <span className="material-symbols-outlined text-[15px] text-emerald-600">
                    mark_chat_read
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    {ticket.replies.length === 1
                      ? '1 ответ отправлен'
                      : `${ticket.replies.length} ответа отправлено`}
                  </span>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  className="flex-1 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">visibility</span>
                  Детали
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReplyTicketId(ticket.id);
                    setReplyContent('');
                    setReplyStatus('');
                  }}
                  className="flex-1 h-10 rounded-2xl bg-primary hover:bg-[#00557a] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[17px]">reply</span>
                  Ответить
                </button>
              </div>
            </article>
          ))
        )}
      </main>

      {replyTicketId !== null && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => !isSending && setReplyTicketId(null)} />
          <div className="relative z-10 w-full max-w-[430px] mx-auto bg-white rounded-t-3xl px-5 pt-4 pb-8 shadow-2xl flex flex-col gap-4">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-1" />
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-sky-50 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">reply</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Ответить на обращение</h3>
                <p className="text-xs text-slate-500">Жилец получит ответ в приложении</p>
              </div>
            </div>

            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Напишите ответ жильцу..."
              rows={4}
              className="w-full p-3.5 bg-slate-50 rounded-2xl text-sm text-slate-900 border border-slate-200 resize-none focus:outline-none focus:border-primary focus:bg-white transition-colors"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Изменить статус (необязательно)
              </label>
              <div className="flex gap-2 flex-wrap">
                {['', 'in_progress', 'completed', 'rejected'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setReplyStatus(s)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                      replyStatus === s
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
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
                className="flex-1 h-11 rounded-2xl bg-slate-100 text-slate-700 font-semibold text-sm cursor-pointer active:scale-[0.98] transition-transform"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleSendReply}
                disabled={isSending || !replyContent.trim()}
                className="flex-1 h-11 rounded-2xl bg-primary hover:bg-[#00557a] text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform shadow-xs disabled:opacity-50"
              >
                {isSending ? (
                  <span className="material-symbols-outlined text-[20px] animate-spin">
                    progress_activity
                  </span>
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

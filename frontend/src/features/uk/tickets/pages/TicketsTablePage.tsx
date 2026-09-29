import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ukApi } from '../../api';
import { formatDate } from '../../../../shared/lib/formatDate';
import { useToast } from '../../../../shared/hooks/useToast';
import { TicketResponseItem } from '../../../mobile/tickets/api';

export const TicketsTablePage: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<TicketResponseItem | null>(null);
  const [newStatus, setNewStatus] = useState<'active' | 'in_progress' | 'completed' | 'rejected'>('in_progress');
  const [statusComment, setStatusComment] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['uk-tickets', statusFilter, search],
    queryFn: () =>
      ukApi.getTickets({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search.trim() || undefined,
      }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, comment }: { id: number; status: 'active' | 'in_progress' | 'completed' | 'rejected'; comment?: string }) =>
      ukApi.updateTicketStatus(id, { status, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uk-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['uk-dashboard'] });
      showToast('Статус заявки успешно обновлен', 'success');
      setSelectedTicket(null);
      setStatusComment('');
    },
    onError: () => {
      showToast('Ошибка при обновлении статуса заявки', 'error');
    },
  });

  const tickets = data?.items ?? [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Новая</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">В работе</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Решено</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">Отклонено</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Реестр обращений</h2>
          <p className="text-sm text-slate-500 mt-0.5">Все заявки жильцов и аварийные сигналы по домам в управлении</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по номеру, теме или адресу..."
              className="h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-primary w-64 shadow-xs"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'all', label: 'Все обращения' },
          { id: 'active', label: 'Новые' },
          { id: 'in_progress', label: 'В работе' },
          { id: 'completed', label: 'Завершенные' },
          { id: 'rejected', label: 'Отклоненные' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setStatusFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              statusFilter === f.id
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Код</th>
                <th className="py-3 px-4">Адрес дома</th>
                <th className="py-3 px-4">Тема и классификатор</th>
                <th className="py-3 px-4">Житель</th>
                <th className="py-3 px-4">Поддержка</th>
                <th className="py-3 px-4">Статус</th>
                <th className="py-3 px-4">Дата</th>
                <th className="py-3 px-4 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">Загрузка обращений...</td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">Обращения не найдены</td>
                </tr>
              ) : (
                tickets.map((t: any) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">{t.code}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{t.house_address}</td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">{t.title}</div>
                      <div className="text-[12px] text-slate-400 truncate">{t.topic_title}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{t.author_full_name || 'Житель'}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary bg-sky-50 px-2 py-0.5 rounded-md">
                        <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                        {t.votes_count}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(t.status)}</td>
                    <td className="py-3.5 px-4 text-slate-500 text-[13px]">{formatDate(t.created_at)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTicket(t);
                          setNewStatus(t.status as any);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-primary hover:text-white text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                      >
                        Сменить статус
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Смена статуса #{selectedTicket.code}</h3>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{selectedTicket.title}</span>
              <p className="text-xs text-slate-400 mt-1">{selectedTicket.house_address}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Новый статус</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold focus:outline-none focus:border-primary"
              >
                <option value="active">Новая</option>
                <option value="in_progress">В работе (назначена бригада)</option>
                <option value="completed">Решено (работы завершены)</option>
                <option value="rejected">Отклонено</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Комментарий диспетчера (опционально)</label>
              <textarea
                rows={3}
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
                placeholder="Укажите подробности выполнения или причину отклонения..."
                className="p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="flex-1 h-10 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={() =>
                  updateStatusMutation.mutate({
                    id: selectedTicket.id,
                    status: newStatus,
                    comment: statusComment.trim() || undefined,
                  })
                }
                disabled={updateStatusMutation.isPending}
                className="flex-1 h-10 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 cursor-pointer disabled:opacity-50"
              >
                {updateStatusMutation.isPending ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

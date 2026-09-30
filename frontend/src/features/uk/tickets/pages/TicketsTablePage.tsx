import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ukApi } from '../../api';
import { formatDate } from '../../../../shared/lib/formatDate';
import { useToast } from '../../../../shared/hooks/useToast';
import { TicketResponseItem } from '../../../mobile/tickets/api';
import { apiClient } from '../../../../shared/api/client';

export const TicketsTablePage: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const [inlineReplyText, setInlineReplyText] = useState<{ [id: number]: string }>({});
  const [inlineReplyStatus, setInlineReplyStatus] = useState<{ [id: number]: 'active' | 'in_progress' | 'completed' | 'rejected' }>({});

  const { data, isLoading } = useQuery({
    queryKey: ['uk-tickets', statusFilter, search],
    queryFn: () =>
      ukApi.getTickets({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search.trim() || undefined,
      }),
  });

  const isAddressedToUk = (t: TicketResponseItem): boolean => {
    if (t.recipients && Array.isArray(t.recipients) && t.recipients.length > 0) {
      return t.recipients.some((r) =>
        r.category === 'uk' ||
        r.code === '1' ||
        r.code === '19' ||
        r.short_name === 'УО' ||
        r.short_name === 'УК' ||
        r.short_name === 'ТСЖ' ||
        (r.full_name && r.full_name.toLowerCase().includes('управляющ'))
      );
    }
    const name = (t as any).recipient_name?.toLowerCase() || '';
    if (name) {
      return name.includes('ук') || name.includes('уо') || name.includes('управляющ') || name.includes('жилкомфорт') || name.includes('тсж');
    }
    return true;
  };

  const getRecipientLabel = (t: TicketResponseItem): string => {
    if (t.recipients && t.recipients.length > 0) {
      return t.recipients.map((r) => r.short_name || r.full_name).join(', ');
    }
    if ((t as any).recipient_name) {
      return (t as any).recipient_name;
    }
    return 'УК «ЖилКомФорт»';
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const replyAndStatusMutation = useMutation({
    mutationFn: async ({ id, status, content }: { id: number; status: 'active' | 'in_progress' | 'completed' | 'rejected'; content: string }) => {
      if (content.trim()) {
        await apiClient.post(`/tickets/${id}/reply`, {
          content: content.trim(),
          new_status: status,
        });
      }
      await ukApi.updateTicketStatus(id, { status, comment: content.trim() || undefined });
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['uk-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['uk-dashboard'] });
      showToast('Ответ сохранен, статус обращения обновлен', 'success');
      setInlineReplyText((prev) => ({ ...prev, [vars.id]: '' }));
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || 'Ошибка при обновлении статуса заявки';
      showToast(msg, 'error');
    },
  });

  const getRecipientIcon = (category: string) => {
    switch (category) {
      case 'water':
        return (
          <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'heating':
        return (
          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          </svg>
        );
      case 'electricity':
        return (
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'elevator':
        return (
          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'Ж';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const tickets = data?.items ?? [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Новая</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">В работе</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Решено</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">Отклонено</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Реестр обращений</h2>
          <p className="text-sm text-slate-500 mt-1">Все входящие заявки жителей, фотоматериалы, классификатор и статус исполнения</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по коду, теме или адресу..."
              className="h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 shadow-xs"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200">
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
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === f.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3 w-10"></th>
                <th className="py-3 px-4">Код</th>
                <th className="py-3 px-4">Адрес и кв.</th>
                <th className="py-3 px-4">Тема и классификатор</th>
                <th className="py-3 px-4">Вложения</th>
                <th className="py-3 px-4">Адресат</th>
                <th className="py-3 px-4">Заявитель</th>
                <th className="py-3 px-4">Солидарность</th>
                <th className="py-3 px-4">Статус</th>
                <th className="py-3 px-4">Дата</th>
                <th className="py-3 px-4 text-right">Управление</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">Загрузка обращений...</td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">Обращения не найдены</td>
                </tr>
              ) : (
                tickets.map((t) => {
                  const isUk = isAddressedToUk(t);
                  const isExpanded = expandedIds.has(t.id);
                  const recipientStr = getRecipientLabel(t);
                  const currentStatus = inlineReplyStatus[t.id] || t.status;
                  const currentText = inlineReplyText[t.id] ?? '';

                  const photos = (t.attachments || []).filter(
                    (att) => att.mime_type?.startsWith('image/') || /\.(jpe?g|png|webp|gif)$/i.test(att.filename)
                  );
                  const docs = (t.attachments || []).filter(
                    (att) => !att.mime_type?.startsWith('image/') && !/\.(jpe?g|png|webp|gif)$/i.test(att.filename)
                  );

                  return (
                    <React.Fragment key={t.id}>
                      <tr
                        onClick={() => toggleExpand(t.id)}
                        className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${isExpanded ? 'bg-blue-50/30' : ''}`}
                      >
                        <td className="py-3.5 px-3 text-center text-slate-400">
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90 text-blue-600' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-xs text-blue-600">#{t.code}</td>
                        <td className="py-3.5 px-4 text-xs font-medium text-slate-800">
                          <div>{t.house_address}</div>
                          {(t as any).apartment_number && (
                            <div className="text-[11px] text-slate-400 font-normal">кв. {(t as any).apartment_number}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-semibold text-xs text-slate-900 truncate">{t.title}</div>
                          <div className="text-[11px] text-slate-400 truncate">{t.topic_title}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          {photos.length > 0 ? (
                            <div className="flex items-center gap-1.5">
                              <div className="w-7 h-7 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                                <img src={photos[0].url} alt="" className="w-full h-full object-cover" />
                              </div>
                              <span className="text-[11px] font-semibold text-slate-600">
                                {photos.length} фото
                              </span>
                            </div>
                          ) : docs.length > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span>{docs.length} док.</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-300">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {isUk ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                              УК
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              {recipientStr}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-700 font-medium">
                          {t.author_full_name || 'Житель'}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                          {t.votes_count > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span>+{t.votes_count}</span>
                            </span>
                          ) : (
                            <span className="text-slate-300">0</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">{getStatusBadge(t.status)}</td>
                        <td className="py-3.5 px-4 text-slate-400 text-xs">{formatDate(t.created_at)}</td>
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => toggleExpand(t.id)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
                          >
                            {isExpanded ? 'Свернуть' : 'Подробнее'}
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-slate-50/70 border-t border-b border-slate-200/80">
                          <td colSpan={11} className="p-6">
                            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col gap-6">
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-slate-100">
                                <div>
                                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                                      #{t.code}
                                    </span>
                                    <span className="text-xs text-slate-400">Подано: {formatDate(t.created_at)}</span>
                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                                      {t.topic_title}
                                    </span>
                                  </div>
                                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{t.title}</h3>
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    {t.house_address} {(t as any).apartment_number ? `• кв. ${(t as any).apartment_number}` : ''}
                                  </p>
                                </div>

                                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 shrink-0">
                                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#006591] via-[#0088cc] to-[#2aabee] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                                    {getInitials(t.author_full_name)}
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-slate-900">
                                      {t.author_full_name || 'Собственник помещения'}
                                    </div>
                                    <div className="text-[11px] text-slate-500 font-medium">
                                      {(t as any).apartment_number ? `Квартира №${(t as any).apartment_number}` : 'Житель МКД'} • Подтвержден
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 flex flex-col gap-5">
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                      Суть обращения
                                    </h4>
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
                                      {t.description || 'Описание проблемы отсутствует'}
                                    </div>
                                  </div>

                                  {photos.length > 0 && (
                                    <div>
                                      <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                          Прикрепленные фотографии ({photos.length})
                                        </h4>
                                        <span className="text-[11px] text-slate-400">Нажмите на фото для просмотра</span>
                                      </div>
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {photos.map((att) => (
                                          <button
                                            key={att.id}
                                            type="button"
                                            onClick={() => setActivePhoto(att.url)}
                                            className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 text-left transition-all hover:border-blue-400 hover:shadow-xs cursor-pointer flex flex-col"
                                          >
                                            <div className="relative w-full h-32 bg-slate-200 overflow-hidden">
                                              <img
                                                src={att.url}
                                                alt={att.filename}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                              />
                                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                                <span className="text-[11px] text-white font-medium flex items-center gap-1">
                                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                  </svg>
                                                  Увеличить
                                                </span>
                                              </div>
                                            </div>
                                            <div className="p-2 min-w-0 bg-white">
                                              <div className="text-xs font-semibold text-slate-800 truncate">
                                                {att.filename}
                                              </div>
                                              <div className="text-[10px] text-slate-400">
                                                {att.size ? `${Math.round(att.size / 1024)} КБ` : 'Изображение'}
                                              </div>
                                            </div>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {docs.length > 0 && (
                                    <div>
                                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                        Документы и приложения ({docs.length})
                                      </h4>
                                      <div className="flex flex-wrap gap-2.5">
                                        {docs.map((att) => (
                                          <a
                                            key={att.id}
                                            href={att.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-xs font-medium text-slate-800 transition cursor-pointer"
                                          >
                                            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                              </svg>
                                            </div>
                                            <div className="min-w-0">
                                              <div className="font-semibold text-slate-900 truncate max-w-[200px]">{att.filename}</div>
                                              <div className="text-[10px] text-slate-400">{att.size ? `${Math.round(att.size / 1024)} КБ` : 'Документ'}</div>
                                            </div>
                                            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {t.replies && t.replies.length > 0 && (
                                    <div>
                                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                        История официальных ответов
                                      </h4>
                                      <div className="space-y-2.5">
                                        {t.replies.map((rep) => (
                                          <div key={rep.id} className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs">
                                            <div className="flex items-center justify-between mb-1">
                                              <span className="font-bold text-slate-900">
                                                {rep.author_name} ({rep.author_role === 'uk_staff' ? 'Сотрудник УК' : 'Председатель совета'})
                                              </span>
                                              <span className="text-[11px] text-slate-400">{formatDate(rep.created_at)}</span>
                                            </div>
                                            <p className="text-slate-700 whitespace-pre-wrap">{rep.content}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col gap-4">
                                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 via-slate-50 to-white border border-blue-100 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                          </svg>
                                        </div>
                                        <span className="text-xs font-bold text-slate-900">Солидарность жильцов</span>
                                      </div>
                                      <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold">
                                        {t.votes_count} чел.
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-snug">
                                      Количество собственников дома, подтвердивших актуальность проблемы в мобильном приложении.
                                    </p>
                                  </div>

                                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Назначенные адресаты
                                      </h4>
                                      <span className="text-[11px] text-slate-400">
                                        {t.recipients?.length || 1} службы
                                      </span>
                                    </div>

                                    <div className="space-y-2">
                                      {t.recipients && t.recipients.length > 0 ? (
                                        t.recipients.map((r, idx) => (
                                          <div
                                            key={r.id}
                                            className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5"
                                          >
                                            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                              {getRecipientIcon(r.category)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="font-bold text-xs text-slate-900 truncate">{r.short_name}</span>
                                                {idx === 0 && (
                                                  <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                                                    Основной
                                                  </span>
                                                )}
                                              </div>
                                              <div className="text-[11px] text-slate-500 truncate">{r.full_name}</div>
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                                          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                            {getRecipientIcon('uk')}
                                          </div>
                                          <div className="min-w-0">
                                            <span className="font-bold text-xs text-slate-900 block truncate">{recipientStr}</span>
                                            <span className="text-[11px] text-slate-400">Управляющая организация</span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {!isUk ? (
                                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col gap-2">
                                      <div className="flex items-center gap-1.5 font-bold text-amber-800">
                                        <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <span>Сторонний адресат ({recipientStr})</span>
                                      </div>
                                      <p className="text-[11px] leading-relaxed text-amber-700">
                                        Обращение направлено в ресурсоснабжающую организацию. Управляющая компания отслеживает сроки и качество решения вопроса.
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col gap-3">
                                      <h4 className="text-xs font-bold text-slate-900">
                                        Управление статусом и ответ
                                      </h4>

                                      <div className="flex flex-col gap-1">
                                        <label className="text-[11px] font-semibold text-slate-600">Статус исполнения</label>
                                        <select
                                          value={currentStatus}
                                          onChange={(e) => setInlineReplyStatus((prev) => ({ ...prev, [t.id]: e.target.value as any }))}
                                          className="h-9 px-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                          <option value="active">Новая</option>
                                          <option value="in_progress">В работе (назначена бригада)</option>
                                          <option value="completed">Решено (работы завершены)</option>
                                          <option value="rejected">Отклонено</option>
                                        </select>
                                      </div>

                                      <div className="flex flex-col gap-1">
                                        <label className="text-[11px] font-semibold text-slate-600">Официальный ответ заявителю</label>
                                        <textarea
                                          rows={3}
                                          value={currentText}
                                          onChange={(e) => setInlineReplyText((prev) => ({ ...prev, [t.id]: e.target.value }))}
                                          placeholder="Напишите официальный ответ или комментарий диспетчера..."
                                          className="p-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        />
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          replyAndStatusMutation.mutate({
                                            id: t.id,
                                            status: currentStatus,
                                            content: currentText,
                                          })
                                        }
                                        disabled={replyAndStatusMutation.isPending}
                                        className="h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
                                      >
                                        {replyAndStatusMutation.isPending ? 'Сохранение...' : 'Отправить ответ и обновить статус'}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex flex-col justify-between p-4"
          onClick={() => setActivePhoto(null)}
        >
          <div className="flex items-center justify-between text-white max-w-5xl mx-auto w-full pt-2">
            <span className="text-xs font-semibold">Просмотр фотоматериала обращения</span>
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition"
              onClick={() => setActivePhoto(null)}
            >
              ✕
            </button>
          </div>
          <div className="flex items-center justify-center flex-1 my-auto max-w-5xl mx-auto w-full p-4">
            <img
              src={activePhoto}
              alt="Увеличенное фото"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
          <div className="text-center text-white/70 text-xs pb-2">
            Нажмите в любом месте, чтобы закрыть окно
          </div>
        </div>
      )}
    </div>
  );
};

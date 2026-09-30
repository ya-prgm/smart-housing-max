import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { votesApi } from '../../../mobile/votes/api';
import { formatDate } from '../../../../shared/lib/formatDate';
import { apiClient } from '../../../../shared/api/client';
import { PollResultsResponse } from '../../../chairman/api';
import { PollCardResponse } from '../../../../shared/types/vote';

const PollExpandedDetails: React.FC<{ pollId: number }> = ({ pollId }) => {
  const { data: results, isLoading, error } = useQuery<PollResultsResponse>({
    queryKey: ['poll-results', pollId],
    queryFn: async () => {
      const res = await apiClient.get<PollResultsResponse>(`/votes/${pollId}/results`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span>Загрузка протокола и результатов голосования...</span>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="py-8 text-center text-xs text-slate-500">
        Не удалось загрузить детальные результаты опроса
      </div>
    );
  }

  const isQuorumReached = results.total_participants >= 50;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
              Протокол #{results.id}
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              isQuorumReached ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {isQuorumReached ? 'Кворум состоялся' : 'Идет набор кворума'}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 leading-snug">{results.title}</h3>
          {results.description && (
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">{results.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center min-w-[90px]">
            <span className="text-xl font-extrabold text-blue-600 block leading-tight">{results.total_participants}</span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Голосов</span>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center min-w-[90px]">
            <span className="text-xl font-extrabold text-slate-900 block leading-tight">{results.questions.length}</span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Вопросов</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {results.questions.map((q, idx) => (
          <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  {idx + 1}
                </span>
                <span className="text-sm font-bold text-slate-900 leading-snug">{q.question_text}</span>
              </div>
              <span className="text-xs font-semibold text-slate-400 shrink-0">
                {q.total_answers} {q.total_answers === 1 ? 'ответ' : q.total_answers < 5 ? 'ответа' : 'ответов'}
              </span>
            </div>

            {q.question_type !== 'text' && (
              <div className="space-y-3 mt-1">
                {q.options.map((opt) => {
                  const isPositive = opt.option_text.toLowerCase().includes('за') || opt.option_text.toLowerCase().includes('да');
                  const isNegative = opt.option_text.toLowerCase().includes('против') || opt.option_text.toLowerCase().includes('нет');

                  const barColor = isPositive ? 'bg-emerald-500' : isNegative ? 'bg-rose-500' : 'bg-blue-600';

                  return (
                    <div key={opt.id} className="flex flex-col gap-1.5 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{opt.option_text}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-medium">{opt.votes} чел.</span>
                          <span className="font-bold text-sm text-slate-900">{opt.percent}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${barColor} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.max(opt.percent, 0)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {q.question_type === 'text' && (
              <div className="space-y-2 mt-1">
                {q.text_answers.length === 0 ? (
                  <div className="text-xs text-slate-400 italic">Ответов пока нет</div>
                ) : (
                  q.text_answers.map((ans, aIdx) => (
                    <div key={aIdx} className="bg-white rounded-xl p-3 text-xs text-slate-700 border border-slate-200 leading-relaxed shadow-xs">
                      «{ans}»
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const VotesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const { data: polls = [], isLoading } = useQuery({
    queryKey: ['uk-votes'],
    queryFn: () => votesApi.getPolls(),
  });

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

  const filteredPolls = polls.filter((p: PollCardResponse) => {
    const isCompleted = p.status === 'completed' || p.is_completed;
    if (filter === 'active' && isCompleted) return false;
    if (filter === 'completed' && !isCompleted) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
    }
    return true;
  });

  const activeCount = polls.filter((p) => p.status !== 'completed' && !p.is_completed).length;
  const completedCount = polls.filter((p) => p.status === 'completed' || p.is_completed).length;
  const totalVotesCast = polls.reduce((acc, p) => acc + (p.participants_count || 0), 0);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Опросы и голосования собственников
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Электронные голосования жителей, подсчет кворума ОСС и детальные протоколы решений
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/uk/votes/new')}
          className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Создать новый опрос</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block leading-tight">{activeCount}</span>
            <span className="text-xs text-slate-500 font-medium">Активных голосований сейчас</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-blue-600 block leading-tight">{totalVotesCast}</span>
            <span className="text-xs text-slate-500 font-medium">Отдано голосов собственниками</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block leading-tight">{completedCount}</span>
            <span className="text-xs text-slate-500 font-medium">Завершенных протоколов решений</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Все опросы ({polls.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('active')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === 'active'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Активные ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filter === 'completed'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Завершенные ({completedCount})
          </button>
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по теме..."
            className="h-9 pl-8 pr-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-56 shadow-xs"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3 w-10"></th>
                <th className="py-3 px-4">Код</th>
                <th className="py-3 px-4">Тема голосования</th>
                <th className="py-3 px-4">Инициатор</th>
                <th className="py-3 px-4">Вопросов</th>
                <th className="py-3 px-4">Явка / Голосов</th>
                <th className="py-3 px-4">Срок окончания</th>
                <th className="py-3 px-4">Статус</th>
                <th className="py-3 px-4 text-right">Протокол</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Загрузка опросов...
                  </td>
                </tr>
              ) : filteredPolls.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Опросы не найдены
                  </td>
                </tr>
              ) : (
                filteredPolls.map((p: PollCardResponse) => {
                  const isExpanded = expandedIds.has(p.id);
                  const isCompleted = p.status === 'completed' || p.is_completed;

                  return (
                    <React.Fragment key={p.id}>
                      <tr
                        onClick={() => toggleExpand(p.id)}
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

                        <td className="py-3.5 px-4 font-mono font-semibold text-xs text-blue-600">
                          #{p.id}
                        </td>

                        <td className="py-3.5 px-4 max-w-sm">
                          <div className="font-bold text-xs text-slate-900 leading-snug">
                            {p.title}
                          </div>
                          {p.description && (
                            <div className="text-[11px] text-slate-400 truncate mt-0.5">
                              {p.description}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                          {p.author?.full_name || 'УК «ЖилКомФорт»'}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-xs text-slate-800">
                            {p.questions_count} вопр.
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg text-xs border border-blue-200">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {p.participants_count} чел.
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 text-xs font-medium">
                          {p.deadline ? formatDate(p.deadline) : 'Бессрочно'}
                        </td>

                        <td className="py-3.5 px-4">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Завершен
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                              Активен
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => toggleExpand(p.id)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-700 text-xs font-semibold transition cursor-pointer shadow-xs"
                          >
                            {isExpanded ? 'Скрыть' : 'Результаты'}
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-slate-50/70 border-t border-b border-slate-200/80">
                          <td colSpan={9} className="p-6">
                            <PollExpandedDetails pollId={p.id} />
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
    </div>
  );
};

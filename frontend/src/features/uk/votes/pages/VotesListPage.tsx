import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { votesApi } from '../../../mobile/votes/api';
import { formatDate } from '../../../../shared/lib/formatDate';

export const VotesListPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: polls = [], isLoading } = useQuery({
    queryKey: ['uk-votes'],
    queryFn: () => votesApi.getPolls(),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Опросы и голосования собственников
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Инициирование юридически значимых опросов и сбор голосов жителей МКД
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/uk/votes/new')}
          className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Создать опрос</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Тема голосования</th>
                <th className="py-3 px-4">Инициатор</th>
                <th className="py-3 px-4">Вопросов</th>
                <th className="py-3 px-4">Участников</th>
                <th className="py-3 px-4">Срок (дедлайн)</th>
                <th className="py-3 px-4">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Загрузка голосований...
                  </td>
                </tr>
              ) : polls.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Опросы пока не созданы
                  </td>
                </tr>
              ) : (
                polls.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">
                      #{p.id}
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-slate-900 leading-snug">
                        {p.title}
                      </div>
                      <div className="text-xs text-slate-400 truncate mt-0.5">
                        {p.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {p.author?.full_name || 'Совет дома'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">
                        {p.questions_count}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-primary bg-sky-50 px-2 py-0.5 rounded-md text-xs">
                        <span className="material-symbols-outlined text-[14px]">
                          group
                        </span>
                        {p.participants_count}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[13px]">
                      {p.deadline ? formatDate(p.deadline) : 'Бессрочно'}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.status === 'completed' || p.is_completed ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Завершен
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-primary border border-sky-200">
                          Активен
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

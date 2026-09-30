import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../../shared/api/client';
import type { PollResultsResponse } from '../api';

export const ChairmanPollResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<PollResultsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    apiClient
      .get<PollResultsResponse>(`/votes/${id}/results`)
      .then(({ data }) => {
        setResults(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError(true);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] px-6 text-center">
        <span className="material-symbols-outlined text-[56px] text-slate-300 mb-3">analytics</span>
        <p className="text-[15px] text-slate-500">Не удалось загрузить результаты</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2.5 bg-primary hover:bg-[#00557a] text-white rounded-2xl text-sm font-semibold cursor-pointer shadow-md active:scale-95 transition-all"
        >
          Назад
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen pb-12 bg-[#f8fafc] text-slate-900 select-none">
      <header className="sticky top-0 z-40 pt-safe bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-xs">
        <div className="h-14 px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 cursor-pointer active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            <span className="text-[14px] font-semibold">Назад</span>
          </button>
          <span className="text-[15px] font-bold text-slate-900">Результаты опроса</span>
          <div className="w-12" />
        </div>
      </header>

      <div className="px-4 pt-4 pb-6 flex flex-col gap-4 max-w-lg mx-auto w-full">
        <div className="bg-gradient-to-tr from-[#006591] via-[#0088cc] to-[#2aabee] rounded-3xl p-5 text-white shadow-card">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">analytics</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-[16px] font-bold leading-snug">{results.title}</h1>
              {results.description && (
                <p className="text-[12px] text-white/80 mt-1 line-clamp-3">{results.description}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-white/20">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 text-center border border-white/20">
              <div className="text-[22px] font-black leading-tight">{results.total_participants}</div>
              <div className="text-[11px] text-white/80 mt-0.5">участников</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 text-center border border-white/20">
              <div className="text-[22px] font-black leading-tight">{results.questions.length}</div>
              <div className="text-[11px] text-white/80 mt-0.5">вопросов</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 text-center border border-white/20 flex flex-col justify-center">
              <div className="text-[13px] font-bold leading-tight">
                {results.status === 'active'
                  ? 'Идёт'
                  : results.status === 'completed'
                  ? 'Завершён'
                  : results.status}
              </div>
              <div className="text-[11px] text-white/80 mt-0.5">статус</div>
            </div>
          </div>
        </div>

        {results.questions.map((q, qIdx) => (
          <div
            key={q.id}
            className="bg-white rounded-3xl p-5 shadow-card border border-slate-200/80 flex flex-col gap-3.5"
          >
            <div className="flex items-start gap-2.5">
              <span className="w-7 h-7 rounded-full bg-sky-100 text-primary text-[13px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {qIdx + 1}
              </span>
              <h3 className="text-[15px] font-bold text-slate-900 leading-snug flex-1">
                {q.question_text}
              </h3>
            </div>

            <div className="text-[12px] text-slate-400 font-medium">
              {q.total_answers === 0
                ? 'Нет ответов'
                : `${q.total_answers} ${
                    q.total_answers === 1 ? 'ответ' : q.total_answers < 5 ? 'ответа' : 'ответов'
                  }`}
            </div>

            {q.question_type !== 'text' &&
              q.options.map((opt) => (
                <div key={opt.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-slate-800 font-medium">{opt.option_text}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[12px] text-slate-400">{opt.votes} гол.</span>
                      <span className="text-[13px] font-bold text-primary">{opt.percent}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#006591] to-[#0088cc] rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(opt.percent, 0)}%` }}
                    />
                  </div>
                </div>
              ))}

            {q.question_type === 'text' && (
              <div className="flex flex-col gap-2">
                {q.text_answers.length === 0 ? (
                  <div className="text-[12px] text-slate-400 text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    Нет ответов
                  </div>
                ) : (
                  q.text_answers.map((ans, i) => (
                    <div
                      key={i}
                      className="bg-slate-50 rounded-2xl px-3.5 py-2.5 text-[13px] text-slate-700 border border-slate-100"
                    >
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

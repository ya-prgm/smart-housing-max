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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f4ff]">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f4ff] px-6 text-center">
        <span className="material-symbols-outlined text-[56px] text-slate-300 mb-3">analytics</span>
        <p className="text-[15px] text-slate-500">Не удалось загрузить результаты</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold cursor-pointer"
        >
          Назад
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen pb-10 bg-[#f0f4ff] text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 pt-safe bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-sm">
        <div className="h-14 px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 cursor-pointer active:opacity-70"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            <span className="text-[15px] font-medium">Назад</span>
          </button>
          <span className="text-[13px] font-bold text-indigo-700">Результаты опроса</span>
        </div>
      </header>

      <div className="px-4 pt-5 pb-6 flex flex-col gap-5">
        {/* Poll Summary */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">analytics</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-[16px] font-bold leading-snug">{results.title}</h1>
              <p className="text-[12px] text-white/70 mt-0.5 line-clamp-2">{results.description}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-3">
            <div className="flex-1 bg-white/15 rounded-xl p-3 text-center">
              <div className="text-[24px] font-black">{results.total_participants}</div>
              <div className="text-[11px] text-white/70">участников</div>
            </div>
            <div className="flex-1 bg-white/15 rounded-xl p-3 text-center">
              <div className="text-[24px] font-black">{results.questions.length}</div>
              <div className="text-[11px] text-white/70">вопросов</div>
            </div>
            <div className="flex-1 bg-white/15 rounded-xl p-3 text-center">
              <div className="text-[14px] font-black capitalize">{
                results.status === 'active' ? '✓ Идёт' :
                results.status === 'completed' ? 'Завершён' : results.status
              }</div>
              <div className="text-[11px] text-white/70">статус</div>
            </div>
          </div>
        </div>

        {/* Questions */}
        {results.questions.map((q, qIdx) => (
          <div key={q.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
            <div className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {qIdx + 1}
              </span>
              <h3 className="text-[14px] font-bold text-slate-900 leading-snug">{q.question_text}</h3>
            </div>

            <div className="text-[11px] text-slate-400">
              {q.total_answers === 0
                ? 'Нет ответов'
                : `${q.total_answers} ${q.total_answers === 1 ? 'ответ' : q.total_answers < 5 ? 'ответа' : 'ответов'}`}
            </div>

            {/* Choice question results */}
            {q.question_type !== 'text' && q.options.map((opt) => (
              <div key={opt.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-slate-700 font-medium">{opt.option_text}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-slate-400">{opt.votes} гол.</span>
                    <span className="text-[13px] font-bold text-indigo-600">{opt.percent}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(opt.percent, 0)}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Text question results */}
            {q.question_type === 'text' && (
              <div className="flex flex-col gap-2">
                {q.text_answers.length === 0 ? (
                  <div className="text-[12px] text-slate-400 text-center py-4">Нет ответов</div>
                ) : (
                  q.text_answers.map((ans, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-700">
                      "{ans}"
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}

        {/* Export hint */}
        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
          <span className="material-symbols-outlined text-[24px] text-indigo-500">info</span>
          <p className="text-[12px] text-indigo-700 leading-relaxed">
            Результаты голосования защищены ПЭП (простой электронной подписью) и могут использоваться в качестве протокола ОСС.
          </p>
        </div>
      </div>
    </div>
  );
};

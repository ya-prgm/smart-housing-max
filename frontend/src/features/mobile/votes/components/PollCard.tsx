import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PollCardResponse } from '../../../../shared/types/vote';

interface PollCardProps {
  poll: PollCardResponse;
}

export const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  const navigate = useNavigate();
  const isCompleted = poll.is_completed;
  const isArchived = poll.status === 'completed' || poll.status === 'archived';
  const isUk = poll.author?.role === 'uk_staff';

  return (
    <article
      onClick={() => navigate(`/votes/${poll.id}`)}
      className={`bg-white p-4 sm:p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col gap-3 transition-all cursor-pointer active:scale-[0.99] hover:border-slate-200 ${
        isArchived ? 'opacity-90' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#ecf4ff] flex items-center justify-center text-primary text-[14px]">
            <span className="material-symbols-outlined text-[16px]">
              {isUk ? 'corporate_fare' : 'shield_person'}
            </span>
          </div>
          <span className="text-[13px] text-slate-800 font-semibold">
            {poll.author?.name || (isUk ? 'УК «ЖилКомФорт»' : 'Председатель ТСЖ')}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {isCompleted ? (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">check_circle</span>
              Пройдено вами
            </span>
          ) : isArchived ? (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
              Завершён
            </span>
          ) : (
            <>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[11px] font-medium border border-rose-100">
                Не пройден
              </span>
              {poll.deadline_text && (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[13px]">alarm</span>
                  {poll.deadline_text}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-[15px] sm:text-[16px] font-bold text-slate-900 leading-snug">
          {poll.title}
        </h2>
        <p className="text-[13px] text-slate-600 mt-1 leading-relaxed line-clamp-2">
          {poll.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {poll.estimated_time && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-medium text-slate-600">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            {poll.estimated_time}
          </span>
        )}
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-medium text-slate-600">
          <span className="material-symbols-outlined text-[14px]">quiz</span>
          {poll.questions_count} вопр.
        </span>
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#c9e6ff] text-[11px] font-medium text-primary">
          <span className="material-symbols-outlined text-[14px]">group</span>
          {poll.participants_count} уч.
        </span>
      </div>

      {!isCompleted && !isArchived && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/votes/${poll.id}`);
          }}
          className="w-full h-11 bg-primary text-white rounded-full font-semibold text-[14px] flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all hover:bg-primary/90 mt-1 cursor-pointer"
        >
          <span>Пройти опрос</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      )}
    </article>
  );
};

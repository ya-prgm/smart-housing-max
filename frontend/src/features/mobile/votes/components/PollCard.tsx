import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PollCardResponse } from '../../../../shared/types/vote';
import { formatDate } from '../../../../shared/lib/formatDate';

interface PollCardProps {
  poll: PollCardResponse;
}

export const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  const navigate = useNavigate();

  const getStatusBadge = () => {
    if (poll.is_completed || poll.status === 'completed') {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">check_circle</span>
          Завершен
        </span>
      );
    }
    if (poll.status === 'active') {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-primary text-[11px] font-semibold flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">schedule</span>
          {poll.deadline ? `До ${formatDate(poll.deadline)}` : 'Активен'}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
        {poll.status}
      </span>
    );
  };

  return (
    <div
      onClick={() => navigate(`/votes/${poll.id}`)}
      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col gap-3 active:scale-[0.99] transition-all cursor-pointer hover:border-slate-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {poll.author?.avatar_url ? (
            <img
              src={poll.author.avatar_url}
              alt=""
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-primary text-[11px] font-bold">
              {poll.author?.full_name?.charAt(0) || 'А'}
            </div>
          )}
          <span className="text-[12px] font-medium text-slate-600">
            {poll.author?.full_name || 'Совет дома'}
          </span>
        </div>
        {getStatusBadge()}
      </div>

      <div>
        <h3 className="text-[15px] font-bold text-slate-900 leading-snug line-clamp-2">
          {poll.title}
        </h3>
        <p className="text-[13px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
          {poll.description}
        </p>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[12px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">quiz</span>
            {poll.questions_count} вопр.
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">group</span>
            {poll.participants_count} уч.
          </span>
        </div>
        <span className="text-primary font-medium flex items-center gap-0.5">
          {poll.is_completed ? 'Смотреть' : 'Голосовать'}
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </span>
      </div>
    </div>
  );
};

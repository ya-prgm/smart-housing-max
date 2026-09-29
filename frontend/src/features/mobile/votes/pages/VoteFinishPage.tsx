import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useVoteDetail } from '../hooks/useVotes';
import { useAuth } from '../../../../shared/hooks/useAuth';
import { FinishSlider } from '../components/FinishSlider';
import { PollDetailResponse, PollAnswerSubmission } from '../../../../shared/types/vote';
import { useToast } from '../../../../shared/hooks/useToast';

export const VoteFinishPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();

  const state = location.state as {
    poll?: PollDetailResponse;
    answers?: PollAnswerSubmission[];
  } | null;

  const { poll: fetchedPoll, submitAnswers, isSubmitting } = useVoteDetail(id);
  const poll = state?.poll || fetchedPoll;
  const answers = state?.answers || [];

  const [isSuccess, setIsSuccess] = useState(false);

  const handleFinish = async () => {
    if (!poll) return;
    try {
      await submitAnswers({
        pollId: poll.id,
        payload: {
          answers,
        },
      });
      setIsSuccess(true);
      showToast('Голос успешно принят и подписан', 'success');
    } catch {
      showToast('Ошибка при отправке голоса. Попробуйте снова.', 'error');
    }
  };

  const apartmentNum = user?.apartment_number;

  return (
    <div className="bg-[#f7f9ff] text-slate-900 min-h-screen flex flex-col relative select-none pb-20">
      <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 pt-safe">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Назад"
              onClick={() => navigate(-1)}
              className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight truncate">
              Подтверждение выбора
            </h1>
          </div>
        </div>
      </header>

      <div className="px-4 py-3 bg-white border-b border-slate-100 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-slate-800 flex items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-[17px]">check_circle</span>
            Все вопросы пройдены
          </span>
          <span className="font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full text-[11px]">
            100%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full w-full" />
        </div>
      </div>

      <main className="px-4 pt-6 flex flex-col items-center max-w-[430px] mx-auto w-full text-center">
        <div className="w-18 h-18 rounded-full bg-sky-100 flex items-center justify-center mb-3 text-primary shadow-xs">
          <span className="material-symbols-outlined text-[36px]">
            {isSuccess ? 'verified' : 'mark_email_read'}
          </span>
        </div>

        <h2 className="text-[22px] font-bold text-slate-900 tracking-tight mb-1">
          {isSuccess ? 'Голос успешно учтён!' : 'Вы ответили на все вопросы'}
        </h2>
        <p className="text-[13px] text-slate-500 max-w-xs mb-5">
          {isSuccess
            ? 'Ваш голос зафиксирован в протоколе голосования МКД'
            : 'Проверьте сводку и подтвердите отправку результатов простой электронной подписью'}
        </p>

        <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-2.5 text-left mb-6">
          <div className="flex items-center gap-2 p-2 bg-sky-50 rounded-xl text-primary font-semibold text-[13px]">
            <span className="material-symbols-outlined text-[20px]">how_to_vote</span>
            <span className="truncate">{poll?.title || 'Голосование собственников'}</span>
          </div>

          <div className="flex items-center justify-between text-[13px] py-1 border-b border-slate-100">
            <span className="text-slate-400">Собственник</span>
            <span className="font-semibold text-slate-900">
              {user?.full_name || 'Житель'} {apartmentNum ? `(кв. ${apartmentNum})` : ''}
            </span>
          </div>

          <div className="flex items-center justify-between text-[13px] py-1 border-b border-slate-100">
            <span className="text-slate-400">Ответов дано</span>
            <span className="font-semibold text-primary">
              {answers.length} из {poll?.questions?.length || answers.length}
            </span>
          </div>

          <div className="flex items-center justify-between text-[13px] py-1">
            <span className="text-slate-400">Способ подписания</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">lock</span>
              ПЭП (Госуслуги / MAX)
            </span>
          </div>
        </div>

        {!isSuccess ? (
          <div className="w-full">
            <FinishSlider
              onSuccess={handleFinish}
              disabled={isSubmitting}
              label={isSubmitting ? 'Отправка...' : 'Проведите для подписания ПЭП'}
              successLabel="Подписано и отправлено"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/votes')}
            className="w-full h-12 bg-primary text-white font-semibold rounded-full shadow-md active:scale-95 transition-all hover:bg-primary/90 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Вернуться к опросам</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        )}
      </main>
    </div>
  );
};
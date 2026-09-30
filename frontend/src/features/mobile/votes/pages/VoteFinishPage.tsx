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
      showToast('Голос успешно принят', 'success');
    } catch {
      showToast('Ошибка при отправке голоса. Попробуйте снова.', 'error');
    }
  };

  const apartmentNum = user?.apartment_number || '48';
  const ownerName = user?.full_name || 'Смирнов А. С.';
  const totalQuestions = poll?.questions?.length || answers.length || 4;

  const now = new Date();
  const formattedDateTime = now.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-[#f7f9ff] text-slate-900 min-h-screen flex flex-col relative select-none pb-20">
      <header className="sticky top-0 w-full z-40 bg-[#f7f9ff]/85 backdrop-blur-xl border-b border-slate-200/70 pt-safe">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              aria-label="Назад"
              onClick={() => navigate(-1)}
              className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-[16px] sm:text-[17px] font-semibold text-slate-900 tracking-tight truncate">
              {poll?.title || 'Завершение опроса'}
            </h1>
          </div>
        </div>
      </header>

      <div className="px-4 py-3 bg-white border-b border-slate-100 flex flex-col gap-1.5 shadow-2xs">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5 text-primary">
            <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
            Все вопросы пройдены
          </span>
          <span className="font-bold text-primary bg-[#d9e2ff] px-2.5 py-0.5 rounded-full text-[11px]">
            100% завершено
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full w-full transition-all duration-500" />
        </div>
      </div>

      <main className="px-4 pt-6 flex flex-col items-center max-w-lg mx-auto w-full text-center">
        <div className="relative w-20 h-20 rounded-full bg-[#e6effa] flex items-center justify-center mb-3 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[30px]">mark_email_read</span>
          </div>
        </div>

        <h2 className="text-[22px] sm:text-[24px] font-bold text-slate-900 tracking-tight mb-1">
          Вы ответили на все вопросы!
        </h2>
        <p className="text-[13px] text-slate-500 max-w-xs mb-5">
          Проверьте сводку и подтвердите отправку ответов
        </p>

        <div className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col gap-3 text-left mb-6">
          <div className="flex items-center gap-2.5 p-3 bg-[#ecf4ff] rounded-xl text-primary font-semibold text-[13px]">
            <span className="material-symbols-outlined text-[22px] shrink-0">how_to_vote</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Опрос дома
              </span>
              <span className="text-[13px] sm:text-[14px] font-semibold text-slate-900 truncate">
                {poll?.title || 'Установка шлагбаума и системы видеонаблюдения'}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-1 text-[13px]">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400 font-medium">Собственник</span>
              <span className="font-semibold text-slate-900">
                {ownerName} (кв. {apartmentNum})
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400 font-medium">Заполнено вопросов</span>
              <span className="font-semibold text-primary">
                {answers.length || totalQuestions} из {totalQuestions} пунктов
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400 font-medium">Дата и время</span>
              <span className="font-medium text-slate-800">{formattedDateTime}</span>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-2">
          <FinishSlider
            onSuccess={handleFinish}
            disabled={isSubmitting || isSuccess}
            label={isSubmitting ? 'Отправка...' : 'Проведите жильца вправо для завершения'}
            successLabel="Голос отправлен!"
          />

          <div className="flex items-center gap-1.5 text-center mt-1">
            <span className="material-symbols-outlined text-[15px] text-primary">send</span>
            <span className="text-[11px] text-slate-500 font-medium leading-snug">
              Сдвиньте бегунок вправо для отправки ответов
            </span>
          </div>

          {!isSuccess && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-3 inline-flex items-center gap-1.5 py-2 px-4 rounded-full text-primary hover:bg-[#ecf4ff] font-semibold text-[13px] active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
              <span>Вернуться и проверить ответы</span>
            </button>
          )}
        </div>
      </main>

      {isSuccess && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col justify-end p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl p-5 sm:p-6 text-center shadow-2xl max-w-lg mx-auto w-full">
            <div className="w-16 h-16 bg-[#ecf4ff] rounded-full mx-auto flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-primary text-[36px]">
                task_alt
              </span>
            </div>
            <h3 className="text-[18px] sm:text-[20px] font-bold text-slate-900 mb-1">
              Голос успешно принят!
            </h3>
            <p className="text-[13px] text-slate-600 mb-5 leading-relaxed">
              Ваши ответы сохранены и учтены в опросе. Спасибо за участие!
            </p>
            <button
              type="button"
              onClick={() => navigate('/votes')}
              className="w-full h-12 bg-primary text-white rounded-full font-semibold text-[15px] shadow-md hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
            >
              Вернуться к сервисам дома
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
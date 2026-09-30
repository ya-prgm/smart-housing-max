import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVoteDetail } from '../hooks/useVotes';
import { useHaptic } from '../../../../shared/hooks/useHaptic';
import { OptionRadio } from '../components/OptionRadio';
import { OptionCheckbox } from '../components/OptionCheckbox';
import { TextAnswer } from '../components/TextAnswer';
import { Skeleton } from '../../../../shared/ui/Skeleton';
import { ErrorState } from '../../../../shared/ui/ErrorState';
import { PollAnswerSubmission } from '../../../../shared/types/vote';

export const VoteStepPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { impact } = useHaptic();
  const { poll, isLoading, isError, refetch } = useVoteDetail(id);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, PollAnswerSubmission>>({});

  if (isLoading) {
    return (
      <div className="bg-[#f7f9ff] min-h-screen flex flex-col p-4 gap-4">
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !poll || !poll.questions || poll.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorState
          title="Вопросы не найдены"
          message="Для данного опроса не найдено доступных вопросов."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const questions = poll.questions;
  const totalSteps = questions.length;
  const currentQuestion = questions[currentStepIndex];
  const currentAnswer = answers[currentQuestion.id] || {
    question_id: currentQuestion.id,
  };

  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / totalSteps) * 100));

  const handleSelectRadio = (optionId: string | number) => {
    impact('light');
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        question_id: currentQuestion.id,
        selected_option_id: Number(optionId),
      },
    }));
  };

  const handleToggleCheckbox = (optionId: string | number) => {
    impact('light');
    const optIdNum = Number(optionId);
    const existingIds = currentAnswer.selected_option_ids || [];
    const exists = existingIds.includes(optIdNum);

    const nextIds = exists
      ? existingIds.filter((x) => x !== optIdNum)
      : [...existingIds, optIdNum];

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        question_id: currentQuestion.id,
        selected_option_ids: nextIds,
        selected_option_id: nextIds[0] || null,
      },
    }));
  };

  const handleTextChange = (text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        question_id: currentQuestion.id,
        text_answer: text,
      },
    }));
  };

  const isMultiple =
    currentQuestion.question_type === 'multiple' ||
    (currentQuestion.question_type as string) === 'multiple_choice';
  const isText = currentQuestion.question_type === 'text';

  const canProceed = isMultiple
    ? Boolean(currentAnswer.selected_option_ids && currentAnswer.selected_option_ids.length > 0)
    : isText
    ? Boolean(currentAnswer.text_answer && currentAnswer.text_answer.trim().length > 0)
    : currentAnswer.selected_option_id !== undefined && currentAnswer.selected_option_id !== null;

  const handleNext = () => {
    impact('medium');
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const answersList = Object.values(answers);
      navigate(`/votes/${id}/finish`, {
        state: {
          poll,
          answers: answersList,
        },
      });
    }
  };

  const handlePrev = () => {
    impact('light');
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="bg-[#f7f9ff] text-slate-900 min-h-screen flex flex-col relative select-none pb-32">
      <header className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all">
        <div className="px-4 pt-2.5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              aria-label="Назад"
              onClick={handlePrev}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-[17px] font-bold text-slate-900 tracking-tight truncate">
              {poll.title}
            </h1>
          </div>
        </div>
      </header>

      <main className="flex flex-col flex-1 relative w-full max-w-lg mx-auto">
        <div className="px-4 pt-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-primary text-[13px] sm:text-[14px] font-semibold">
              <span className="material-symbols-outlined text-[18px]">
                {isMultiple ? 'checklist' : 'assignment_turned_in'}
              </span>
              <span>
                Вопрос {currentStepIndex + 1} из {totalSteps}
              </span>
            </div>
            <span className="text-[12px] text-slate-500 font-medium">
              {progressPercent}% завершено
            </span>
          </div>

          <div className="w-full h-1.5 bg-[#e6effa] rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="px-4 mt-3">
          <div className="relative overflow-hidden rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ecf4ff] text-primary text-[11px] font-semibold">
                {isMultiple
                  ? 'Несколько вариантов'
                  : isText
                  ? 'Развернутый ответ'
                  : 'Один вариант'}
              </span>
            </div>

            <h2 className="text-[16px] sm:text-[18px] font-bold text-slate-900 leading-snug tracking-tight">
              {currentQuestion.question_text}
            </h2>

            {currentQuestion.subtext && (
              <p className="text-[13px] text-slate-500 leading-relaxed">
                {currentQuestion.subtext}
              </p>
            )}

            {currentQuestion.image_url && (
              <div className="relative w-full h-36 rounded-xl overflow-hidden mt-1.5 bg-slate-100 shadow-xs">
                <img
                  src={currentQuestion.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-[11px] font-semibold px-2 py-1 rounded bg-black/40 backdrop-blur-md">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  <span>Въезд с ул. Баумана (проект)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 mt-3 flex flex-col gap-2.5">
          {!isMultiple && !isText && (
            <div className="flex flex-col gap-2">
              {currentQuestion.options.map((opt) => (
                <OptionRadio
                  key={opt.id}
                  id={opt.id}
                  label={opt.option_text}
                  subtext={opt.subtext}
                  isSelected={currentAnswer.selected_option_id === opt.id}
                  onSelect={handleSelectRadio}
                />
              ))}
            </div>
          )}

          {isMultiple && (
            <div className="flex flex-col gap-2">
              {currentQuestion.options.map((opt) => {
                const isSelected = Boolean(
                  currentAnswer.selected_option_ids &&
                    currentAnswer.selected_option_ids.includes(opt.id)
                );
                return (
                  <OptionCheckbox
                    key={opt.id}
                    id={opt.id}
                    label={opt.option_text}
                    subtext={opt.subtext}
                    isSelected={isSelected}
                    onToggle={handleToggleCheckbox}
                  />
                );
              })}
            </div>
          )}

          {isText && (
            <TextAnswer
              value={currentAnswer.text_answer || ''}
              onChange={handleTextChange}
            />
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl shadow-lg px-4 py-3 pb-safe border-t border-slate-200/60 max-w-lg mx-auto w-full">
        <div className="flex flex-col gap-2 w-full">
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            className={`w-full h-12 rounded-full font-semibold text-[15px] flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
              canProceed
                ? 'bg-primary text-white hover:bg-primary/90 active:scale-[0.98]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>
              {currentStepIndex === totalSteps - 1
                ? 'К завершению опроса'
                : 'Ответить и продолжить'}
            </span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>

          {currentStepIndex > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="w-full h-9 rounded-full bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-[13px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">arrow_back</span>
              <span>Предыдущий вопрос</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
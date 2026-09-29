import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVoteDetail } from '../hooks/useVotes';
import { useHaptic } from '../../../../shared/hooks/useHaptic';
import { ProgressBar } from '../components/ProgressBar';
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
  const currentQuestion = questions[currentStepIndex];
  const totalSteps = questions.length;
  const currentAnswer = answers[currentQuestion.id] || {
    question_id: currentQuestion.id,
  };

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
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        question_id: currentQuestion.id,
        selected_option_id: Number(optionId),
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

  const handleNext = () => {
    impact('medium');
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
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
    } else {
      navigate(-1);
    }
  };

  const canProceed =
    currentAnswer.selected_option_id !== undefined ||
    (currentAnswer.text_answer && currentAnswer.text_answer.trim().length > 0);

  return (
    <div className="bg-[#f7f9ff] text-slate-900 min-h-screen flex flex-col relative select-none pb-28">
      <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 pt-safe">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Назад"
              onClick={handlePrev}
              className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight truncate max-w-[240px]">
              {poll.title}
            </h1>
          </div>
        </div>
      </header>

      <main className="px-4 pt-3 flex flex-col gap-4 max-w-[430px] mx-auto w-full">
        <ProgressBar currentStep={currentStepIndex + 1} totalSteps={totalSteps} />

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-primary text-[11px] font-semibold w-max">
            {currentQuestion.question_type === 'single'
              ? 'Один вариант'
              : currentQuestion.question_type === 'multiple'
              ? 'Несколько вариантов'
              : 'Развернутый ответ'}
          </span>
          <h2 className="text-[16px] font-bold text-slate-900 leading-snug">
            {currentQuestion.question_text}
          </h2>
          {currentQuestion.subtext && (
            <p className="text-[13px] text-slate-500 leading-relaxed">
              {currentQuestion.subtext}
            </p>
          )}

          {currentQuestion.image_url && (
            <div className="relative w-full h-36 rounded-xl overflow-hidden mt-1 bg-slate-100">
              <img
                src={currentQuestion.image_url}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          {currentQuestion.question_type === 'single' &&
            currentQuestion.options.map((opt) => (
              <OptionRadio
                key={opt.id}
                id={opt.id}
                label={opt.option_text}
                subtext={opt.subtext}
                isSelected={currentAnswer.selected_option_id === opt.id}
                onSelect={handleSelectRadio}
              />
            ))}

          {currentQuestion.question_type === 'multiple' &&
            currentQuestion.options.map((opt) => (
              <OptionCheckbox
                key={opt.id}
                id={opt.id}
                label={opt.option_text}
                subtext={opt.subtext}
                isSelected={currentAnswer.selected_option_id === opt.id}
                onToggle={handleToggleCheckbox}
              />
            ))}

          {currentQuestion.question_type === 'text' && (
            <TextAnswer
              value={currentAnswer.text_answer || ''}
              onChange={handleTextChange}
            />
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/70 p-4 pb-safe flex gap-3">
        <button
          type="button"
          onClick={handlePrev}
          className="h-12 px-5 rounded-full border border-slate-200 text-slate-700 font-semibold text-[14px] hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
        >
          Назад
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          className={`flex-1 h-12 rounded-full font-semibold text-[15px] flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
            canProceed
              ? 'bg-primary text-white hover:bg-primary/90 active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>{currentStepIndex === totalSteps - 1 ? 'К подтверждению' : 'Далее'}</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
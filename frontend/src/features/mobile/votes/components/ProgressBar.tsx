import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const percent = Math.min(100, Math.round((currentStep / Math.max(1, totalSteps)) * 100));

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between text-[13px]">
        <div className="flex items-center gap-1 text-primary font-semibold">
          <span className="material-symbols-outlined text-[17px]">assignment_turned_in</span>
          <span>Вопрос {currentStep} из {totalSteps}</span>
        </div>
        <span className="text-slate-500 font-medium">{percent}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

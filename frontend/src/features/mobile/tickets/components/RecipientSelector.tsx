import React from 'react';
import { useHaptic } from '../../../../shared/hooks/useHaptic';

export interface RecipientOption {
  id: string;
  code: string;
  name: string;
  role: string;
  icon: string;
  checked: boolean;
}

interface RecipientSelectorProps {
  recipients: RecipientOption[];
  onToggle: (id: string) => void;
}

export const RecipientSelector: React.FC<RecipientSelectorProps> = ({
  recipients,
  onToggle,
}) => {
  const { impact } = useHaptic();

  const handleToggle = (id: string) => {
    impact('light');
    onToggle(id);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-bold text-slate-800">
          Адресаты обращения
        </label>
        <span className="text-[11px] text-slate-400">
          Выбрано: {recipients.filter((r) => r.checked).length}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {recipients.map((r) => (
          <div
            key={r.id}
            onClick={() => handleToggle(r.id)}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
              r.checked
                ? 'bg-sky-50/70 border-primary shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  r.checked ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-[19px]">
                  {r.icon}
                </span>
              </div>
              <div className="flex flex-col truncate">
                <span className="text-[13px] font-bold text-slate-900 truncate">
                  {r.name}
                </span>
                <span className="text-[11px] text-slate-500 truncate">
                  {r.role}
                </span>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all ${
                r.checked
                  ? 'bg-primary border-primary text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {r.checked && (
                <span className="material-symbols-outlined text-[16px] leading-none">
                  check
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

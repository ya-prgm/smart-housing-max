import React, { useState } from 'react';
import { useHaptic } from '../../../../shared/hooks/useHaptic';

interface AccountCopyProps {
  accountNumber: string;
}

export const AccountCopy: React.FC<AccountCopyProps> = ({ accountNumber }) => {
  const { impact, notification } = useHaptic();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    impact('light');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(accountNumber);
    }
    setCopied(true);
    notification('success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60 select-none">
      <span className="text-[12px] text-slate-500 font-medium">Лицевой счёт:</span>
      <span className="text-[13px] font-semibold text-slate-800 tracking-wide font-mono">
        {accountNumber}
      </span>
      <button
        type="button"
        aria-label="Копировать номер счета"
        onClick={handleCopy}
        className={`flex items-center gap-1 text-[11px] font-semibold pl-1 transition-colors active:scale-95 cursor-pointer ${
          copied ? 'text-emerald-600' : 'text-[#006591] hover:text-[#0056c4]'
        }`}
      >
        <span className="material-symbols-outlined text-[15px]">
          {copied ? 'check' : 'content_copy'}
        </span>
        <span>{copied ? 'Скопировано!' : 'Копировать'}</span>
      </button>
    </div>
  );
};

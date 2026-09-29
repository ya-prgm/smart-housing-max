import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatMoney } from '../../../../shared/lib/formatMoney';

interface UtilityCardProps {
  debtAmount: number;
  isDebtFree: boolean;
  paymentDeadline?: string | null;
}

export const UtilityCard: React.FC<UtilityCardProps> = ({
  debtAmount,
  isDebtFree,
  paymentDeadline = 'до 10 числа',
}) => {
  const navigate = useNavigate();
  const hasDebt = !isDebtFree && debtAmount > 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate('/profile/utility')}
      className="w-full bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card flex flex-col gap-4 cursor-pointer hover:border-slate-300 active:scale-[0.99] transition-all group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-50 to-blue-50 border border-slate-200/60 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">receipt_long</span>
          </div>
          <div className="flex flex-col text-left">
            <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
              Жилищно-коммунальные услуги
            </h3>
            <p className="text-[12px] text-slate-500">
              Срок оплаты: {paymentDeadline || 'до 10 числа'}
            </p>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all">
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
        <div className="flex flex-col text-left">
          <span className="text-[12px] text-slate-500">
            {hasDebt ? 'К оплате за месяц:' : 'Начисления за месяц:'}
          </span>
          <span
            className={`text-[20px] font-bold tracking-tight ${
              hasDebt ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {hasDebt ? formatMoney(debtAmount) : '0 ₽'}
          </span>
        </div>

        {!hasDebt ? (
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[12px] font-semibold flex items-center gap-1.5 border border-emerald-100">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            Оплачено
          </span>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/profile/utility');
            }}
            className="px-4 py-2 rounded-xl bg-primary text-white text-[13px] font-semibold shadow-xs hover:bg-primary/90 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>Оплатить</span>
          </button>
        )}
      </div>
    </div>
  );
};

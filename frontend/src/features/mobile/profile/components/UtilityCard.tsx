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

  return (
    <div
      onClick={() => navigate('/utility')}
      className="w-full bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card flex flex-col gap-4 cursor-pointer hover:border-slate-300 transition-all active:scale-[0.99]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
              Жилищно-коммунальные услуги
            </h3>
            <p className="text-[12px] text-slate-500">
              Срок оплаты: {paymentDeadline || 'до 10 числа'}
            </p>
          </div>
        </div>

        <span className="material-symbols-outlined text-slate-400 text-[20px]">
          chevron_right
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[12px] text-slate-500">К оплате за месяц:</span>
          <span
            className={`text-[20px] font-bold tracking-tight ${
              debtAmount > 0 ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {formatMoney(debtAmount)}
          </span>
        </div>

        {isDebtFree || debtAmount === 0 ? (
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[12px] font-semibold flex items-center gap-1 border border-emerald-100">
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            Оплачено
          </span>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/utility');
            }}
            className="px-4 py-2 rounded-full bg-primary text-white text-[13px] font-semibold shadow-xs hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
          >
            Оплатить
          </button>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useHaptic } from '../../../../shared/hooks/useHaptic';
import { formatMoney } from '../../../../shared/lib/formatMoney';
import { useToast } from '../../../../shared/hooks/useToast';
import { AccountCopy } from '../components/AccountCopy';

export const UtilityPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { impact, notification } = useHaptic();
  const { showToast } = useToast();

  const [isPaid, setIsPaid] = useState(profile?.is_debt_free ?? true);
  const debt = isPaid ? 0 : profile?.debt_amount || 4820;

  const utilityItems = [
    { title: 'Содержание и текущий ремонт жилья', amount: 1650, icon: 'home_repair_service' },
    { title: 'Отопление (тепловая энергия)', amount: 1420, icon: 'mode_heat' },
    { title: 'Горячее водоснабжение (ГВС)', amount: 680, icon: 'water_drop' },
    { title: 'Холодное водоснабжение и водоотведение', amount: 490, icon: 'water' },
    { title: 'Электроснабжение', amount: 390, icon: 'bolt' },
    { title: 'Обращение с ТКО', amount: 120, icon: 'delete' },
    { title: 'Обслуживание домофона', amount: 70, icon: 'call' },
  ];

  const handlePay = () => {
    impact('medium');
    setIsPaid(true);
    notification('success');
    showToast('Оплата начислений ЖКУ успешно совершена через СБП!', 'success');
  };

  const handleDownloadEPD = () => {
    impact('light');
    showToast('Квитанция ЕПД сформирована и загружена', 'info');
  };

  return (
    <div className="bg-[#f7f9ff] text-slate-900 min-h-screen flex flex-col relative select-none pb-24">
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
            <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight">
              ЖКХ и начисления
            </h1>
          </div>
        </div>
      </header>

      <main className="px-4 pt-4 flex flex-col gap-4 max-w-[430px] mx-auto w-full">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[12px] text-slate-400 font-medium">Текущий период</span>
              <span className="text-[16px] font-bold text-slate-900">ЕПД за текущий месяц</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1 border ${
                debt === 0
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  : 'bg-rose-50 text-rose-600 border-rose-100'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">
                {debt === 0 ? 'check_circle' : 'schedule'}
              </span>
              {debt === 0 ? 'Оплачено' : 'К оплате'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
            <span className="text-[12px] text-slate-500 font-medium">Итого к оплате:</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[32px] font-bold text-slate-900 tracking-tight leading-none">
                {formatMoney(debt)}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Срок оплаты без начисления пени — до 10 числа следующего месяца
            </span>
          </div>

          {profile?.personal_account && (
            <AccountCopy accountNumber={profile.personal_account} />
          )}

          {debt > 0 ? (
            <button
              type="button"
              onClick={handlePay}
              className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">bolt</span>
              <span>Оплатить через СБП (0% комиссии)</span>
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-emerald-800 text-[13px] font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-emerald-600 shrink-0">
                verified
              </span>
              <span>Задолженностей по ЖКУ не обнаружено. Спасибо за своевременную оплату!</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleDownloadEPD}
            className="w-full h-11 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-[13px] flex items-center justify-center gap-2 border border-slate-200/80 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">
              download
            </span>
            <span>Квитанция ЕПД (PDF)</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card flex flex-col gap-3">
          <h2 className="text-[15px] font-bold text-slate-900">
            Детализация по услугам
          </h2>

          <div className="flex flex-col divide-y divide-slate-100">
            {utilityItems.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">
                      {item.icon}
                    </span>
                  </div>
                  <span className="text-[13px] text-slate-700 font-medium">
                    {item.title}
                  </span>
                </div>
                <span className="text-[13px] font-semibold text-slate-900 shrink-0 pl-2">
                  {formatMoney(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

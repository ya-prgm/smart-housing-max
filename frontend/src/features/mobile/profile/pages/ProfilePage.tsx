import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHaptic } from '../../../../shared/hooks/useHaptic';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { impact, notification } = useHaptic();
  const [copied, setCopied] = useState(false);

  const accountNumber = '8492-3019-44';

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
    <div className="flex flex-col w-full relative min-h-screen">
      <header className="sticky top-0 w-full z-30 pt-safe bg-white/95 backdrop-blur-xl border-b border-slate-200/70">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              alt="МОЙ ДОМ"
              className="w-8 h-8 rounded-full object-cover shadow-xs border border-slate-200/80 shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ-TbEZAlwJ02pP5Eh-STXcug7iK8FXGZJn97uHCGTVPb9ExV6Kw1HlRXoommDdwCWvU3dOU_3CtxbQ_sMSKsnmN_vwDv7bK2lPMg8bAVVnkmZ5ojqPFuJ6oFcdJtRMnJNQ0kSLOKVMUQxmgAGieGfmYaKmiQ9NHGW2-IqbhvnBEDv_UwzqnzSYQ_GgSkdM3QPo9OA3J5PniFSU-H7rQjNINABwo8e-3W-7Xu-zYNsmItrfPuQvFVTcXMhWZJiJuo7"
            />
            <span className="text-[17px] font-bold text-slate-900 tracking-tight">МОЙ ДОМ</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="relative">
              <button
                type="button"
                aria-label="Уведомления"
                onClick={() => navigate('/notifications')}
                className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 active:scale-95 border border-slate-200/60 flex items-center justify-center text-slate-600 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white pointer-events-none" />
            </div>
            <button
              type="button"
              aria-label="Настройки"
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-600 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full px-4 pt-4 pb-28">
        <div className="w-full max-w-md flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card flex flex-col items-center text-center">
            <div className="relative shrink-0 mb-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#006591] via-[#0088cc] to-[#2aabee] flex items-center justify-center text-white font-bold text-[24px] shadow-md tracking-wider">
                АС
              </div>
            </div>

            <h1 className="text-xl font-bold text-slate-900 leading-tight mb-2">
              Смирнов Александр Сергеевич
            </h1>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#006591] text-[12px] font-semibold mb-3">
              <span className="material-symbols-outlined text-[14px]">home</span>
              <span>Собственник • кв. 48</span>
            </div>

            <div className="flex items-center justify-center gap-1 text-[13px] text-slate-500 mb-3">
              <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
              <span>г. Москва, ул. Баумана, д. 12, кв. 48</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[12px] text-slate-500 font-medium">Лицевой счёт:</span>
              <span className="text-[13px] font-semibold text-slate-800 tracking-wide font-mono">
                {accountNumber}
              </span>
              <button
                type="button"
                aria-label="Копировать номер счета"
                onClick={handleCopy}
                className={`flex items-center gap-1 text-[11px] font-semibold pl-1 transition-colors active:scale-95 ${
                  copied ? 'text-emerald-600' : 'text-[#006591] hover:text-[#0056c4]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Скопировано!' : 'Копировать'}</span>
              </button>
            </div>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate('/profile/house')}
            className="w-full bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card flex items-center justify-between hover:bg-sky-50/40 active:scale-[0.99] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-50 to-blue-50 border border-slate-200/60 flex items-center justify-center text-[#006591] shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">domain</span>
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[16px] font-bold text-slate-900 group-hover:text-[#006591] transition-colors truncate">
                  О доме
                </span>
                <span className="text-[12px] text-slate-500 leading-tight truncate">
                  Паспорт дома, конструктив, управляющая организация, совет МКД
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-[#006591] group-hover:translate-x-0.5 transition-all">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-[#006591]">
                  <span className="material-symbols-outlined text-[19px]">receipt_long</span>
                </div>
                <h2 className="text-[16px] font-bold text-slate-900">ЖКХ и начисления</h2>
              </div>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[12px] text-slate-500">
                <span>К оплате за апрель (до 10 мая):</span>
                <span className="text-emerald-600 font-medium">Без долгов</span>
              </div>
              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-[32px] font-bold text-slate-900 tracking-tight leading-none">4 820</span>
                <span className="text-[20px] font-bold text-slate-500">₽</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-0.5">
              <button
                type="button"
                className="w-full h-12 rounded-2xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-xs shadow-sky-500/20 active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">bolt</span>
                <span>Оплатить через СБП (0% комиссии)</span>
              </button>
              <button
                type="button"
                className="w-full h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium text-[13px] flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined text-[17px] text-slate-400">download</span>
                <span>Квитанция ЕПД (PDF)</span>
              </button>
            </div>
          </div>

          <div
            role="button"
            tabIndex={0}
            className="w-full bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card flex items-center justify-between hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-sky-50 group-hover:text-[#006591] transition-colors shrink-0">
                <span className="material-symbols-outlined text-[20px]">settings</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[15px] font-semibold text-slate-900 group-hover:text-[#006591] transition-colors">
                  Настройки
                </span>
                <span className="text-[12px] text-slate-500">Безопасность, PIN-код, уведомления</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};
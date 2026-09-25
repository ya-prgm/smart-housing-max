import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHaptic } from '../../../../shared/hooks/useHaptic';

export const HouseInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { impact, notification } = useHaptic();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    impact('light');
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const copyText = (val: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(val);
    }
    notification('success');
    showToast(label);
  };

  return (
    <div className="bg-[#f7f9ff] font-sans text-slate-900 flex flex-col min-h-screen relative select-none pb-12">
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-4 py-2 rounded-full text-[13px] shadow-lg flex items-center gap-2 animate-fadeIn pointer-events-none">
          <span className="material-symbols-outlined text-[18px] text-sky-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <header className="fixed top-0 w-full z-40 pt-safe bg-white/90 backdrop-blur-xl shadow-xs border-b border-slate-200/70">
        <div className="h-14 px-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Назад"
              onClick={() => navigate(-1)}
              className="w-11 h-11 flex items-center justify-center rounded-full text-slate-800 hover:bg-slate-100 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-[18px] font-semibold text-slate-900">О доме</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full pt-16 px-4 max-w-md mx-auto">
        <div className="flex flex-col w-full space-y-4">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200/80 p-4 flex flex-col gap-3">
            <div className="flex flex-col gap-1 pt-1">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Многоквартирный дом
              </p>
              <h2 className="text-[24px] font-bold text-slate-900 leading-tight">
                ул. Баумана, д. 12
              </h2>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[20px] text-slate-400 mt-0.5 shrink-0">
                  pin_drop
                </span>
                <p className="text-[14px] text-slate-600 leading-snug">
                  420111, Республика Татарстан, г. Казань, Вахитовский район
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[12px] font-medium">
                  <span className="material-symbols-outlined text-[15px]">stairs</span>
                  <span>10 этажей</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[12px] font-medium">
                  <span className="material-symbols-outlined text-[15px]">door_front</span>
                  <span>4 подъезда</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast('Загрузка электронного паспорта...')}
              className="w-full mt-1 flex items-center justify-between p-3.5 rounded-2xl bg-sky-50 text-[#006591] hover:bg-sky-100 active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-200/70 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-semibold text-slate-900">Электронный паспорт дома</p>
                  <p className="text-[12px] text-slate-500">Реестр БТИ, техплан и акты проверок</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[20px] text-slate-400">arrow_forward</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-[17px] font-bold text-slate-900 px-1">Параметры здания</h2>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl bg-white p-3.5 flex flex-col justify-between shadow-xs border border-slate-200/80">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#0056c4] mb-2">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Год ввода в строй</span>
                  <span className="text-[18px] font-bold text-slate-900">1998 г.</span>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-3.5 flex flex-col justify-between shadow-xs border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">analytics</span>
                  </div>
                  <span className="text-[11px] text-slate-400">на 01.01.2022</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[18px] font-bold text-slate-900">23%</span>
                    <span className="text-[11px] text-slate-400">износ</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '23%' }} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-3.5 flex flex-col justify-between shadow-xs border border-slate-200/80">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary mb-2">
                  <span className="material-symbols-outlined text-[18px]">square_foot</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Общая площадь</span>
                  <span className="text-[18px] font-bold text-slate-900">4 116 м²</span>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-3.5 flex flex-col justify-between shadow-xs border border-slate-200/80">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#0056c4] mb-2">
                  <span className="material-symbols-outlined text-[18px]">family_home</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Жилая площадь</span>
                  <span className="text-[18px] font-bold text-slate-900">3 253.9 м²</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white shadow-xs border border-slate-200/80 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between py-1">
                <div className="min-w-0 pr-2">
                  <p className="text-[11px] text-slate-400 font-medium">Кадастровый номер</p>
                  <p className="text-[14px] font-semibold text-slate-900 truncate">72:23:0216002:1298</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyText('72:23:0216002:1298', 'Кадастровый номер скопирован')}
                  className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-primary active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                </button>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Серия, тип проекта</p>
                  <p className="text-[14px] font-semibold text-slate-900">86-08.86</p>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Материал несущих стен</p>
                  <p className="text-[14px] font-semibold text-slate-900">Стены кирпичные</p>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-[11px] text-slate-400 font-medium">Код ФИАС</p>
                    <p className="text-[13px] font-mono text-slate-900 truncate">
                      43abde73-2dc6-42a3-8e85-984c049ef046
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText('43abde73-2dc6-42a3-8e85-984c049ef046', 'Код ФИАС скопирован')}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">Код ОКТМО</p>
                    <p className="text-[14px] font-semibold text-slate-900">71701000001</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText('71701000001', 'Код ОКТМО скопирован')}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[17px] font-bold text-slate-900">Управление домом</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-semibold">
                Форма: УК
              </span>
            </div>

            <div className="rounded-3xl bg-white shadow-xs border border-slate-200/80 p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[24px]">corporate_fare</span>
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-slate-900">ООО «ЖилКомФорт»</p>
                    <p className="text-[12px] text-slate-500">Управляющая организация</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-400 font-medium">Руководитель</p>
                <p className="text-[14px] font-semibold text-slate-900 mt-0.5">Волков А. С.</p>
              </div>

              <button
                type="button"
                onClick={() => showToast('Вызов диспетчерской службы...')}
                className="w-full py-2.5 px-3 rounded-full bg-primary text-white text-[14px] font-semibold flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span>Диспетчер (круглосуточно)</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[17px] font-bold text-slate-900">Ресурсоснабжение (РСО)</h2>
              <span className="text-[12px] text-slate-400">3 организации</span>
            </div>

            <div className="flex flex-col gap-2">
              <div
                role="button"
                tabIndex={0}
                onClick={() => showToast('АО «Татэнерго»')}
                className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-3.5 flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">mode_heat</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-slate-900 truncate">АО «Татэнерго»</p>
                    <p className="text-[12px] text-slate-500 truncate">Отопление и горячее водоснабжение</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] text-slate-400 shrink-0">chevron_right</span>
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => showToast('МУП «Водоканал»')}
                className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-3.5 flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-11 h-11 rounded-2xl bg-sky-50 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">water_drop</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-slate-900 truncate">МУП «Водоканал»</p>
                    <p className="text-[12px] text-slate-500 truncate">Холодное водоснабжение и водоотведение</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] text-slate-400 shrink-0">chevron_right</span>
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => showToast('АО «Татэнергосбыт»')}
                className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-3.5 flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">bolt</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-slate-900 truncate">АО «Татэнергосбыт»</p>
                    <p className="text-[12px] text-slate-500 truncate">Электроснабжение, расчётные квитанции</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] text-slate-400 shrink-0">chevron_right</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
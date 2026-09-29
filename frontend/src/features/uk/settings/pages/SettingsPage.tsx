import React, { useState } from 'react';
import { useToast } from '../../../../shared/hooks/useToast';

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast();

  const [companyName, setCompanyName] = useState('ООО «ЖилКомФорт»');
  const [inn, setInn] = useState('1655389201');
  const [dispatcherPhone, setDispatcherPhone] = useState('+7 (843) 236-41-12');
  const [emergencyPhone, setEmergencyPhone] = useState('+7 (843) 236-00-00');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Настройки организации успешно сохранены', 'success');
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Параметры и реквизиты управляющей организации
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Контактные телефоны аварийных служб, реквизиты для жителей и интеграции
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-slate-900 text-base">Реквизиты организации</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Наименование УК</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">ИНН организации</label>
              <input
                type="text"
                value={inn}
                onChange={(e) => setInn(e.target.value)}
                className="h-10 px-3.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-slate-900 text-base">Телефоны служб (отображаются в мобильном приложении)</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Аварийно-диспетчерская служба (24/7)</label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Телефон диспетчера по заявкам</label>
              <input
                type="text"
                value={dispatcherPhone}
                onChange={(e) => setDispatcherPhone(e.target.value)}
                className="h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-3">
          <h3 className="font-bold text-slate-900 text-base">Статус внешних шлюзов и интеграций</h3>

          <div className="flex flex-col divide-y divide-slate-100">
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-slate-800">MAX Bot API & WebApp Bridge</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                Подключено
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-slate-800">ГИС ЖКХ / ЕИАС РФ</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                Синхронизировано
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-slate-800">ЕСИА Госуслуги (ПЭП)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                Активно
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="h-11 bg-primary text-white rounded-xl font-bold text-sm shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer max-w-xs"
        >
          <span>Сохранить настройки</span>
        </button>
      </form>
    </div>
  );
};

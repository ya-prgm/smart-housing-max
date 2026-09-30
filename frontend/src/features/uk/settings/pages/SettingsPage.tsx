import React, { useState } from 'react';
import { useToast } from '../../../../shared/hooks/useToast';

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast();

  const [companyName, setCompanyName] = useState('ООО «ЖилКомФорт»');
  const [inn, setInn] = useState('1655389201');
  const [ogrn, setOgrn] = useState('1151690048210');
  const [address, setAddress] = useState('г. Казань, ул. Кремлевская, д. 8, оф. 401');
  const [dispatcherPhone, setDispatcherPhone] = useState('+7 (843) 236-41-12');
  const [emergencyPhone, setEmergencyPhone] = useState('+7 (843) 236-00-00');
  const [email, setEmail] = useState('dispatch@zhilkomfort.ru');
  const [workingHours, setWorkingHours] = useState('Пн–Пт: 08:00 – 17:00 (обед 12:00 – 13:00)');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Параметры управляющей организации успешно сохранены', 'success');
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Параметры и реквизиты организации
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Контактные телефоны диспетчерской, аварийных служб и данные для жителей
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Юридические реквизиты</h3>
              <p className="text-xs text-slate-400">Данные отображаются в техническом паспорте дома и документах</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Наименование управляющей компании</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">ИНН организации</label>
              <input
                type="text"
                value={inn}
                onChange={(e) => setInn(e.target.value)}
                className="h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">ОГРН</label>
              <input
                type="text"
                value={ogrn}
                onChange={(e) => setOgrn(e.target.value)}
                className="h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Фактический адрес главного офиса</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Телефоны служб для жителей</h3>
              <p className="text-xs text-slate-400">Публикуются в мобильном приложении собственников и на стендах</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Аварийно-диспетчерская служба (24/7)</label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Телефон диспетчера по заявкам</label>
              <input
                type="text"
                value={dispatcherPhone}
                onChange={(e) => setDispatcherPhone(e.target.value)}
                className="h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Электронная почта для обращений</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Режим работы офиса</label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Сохранить параметры</span>
          </button>
        </div>
      </form>
    </div>
  );
};

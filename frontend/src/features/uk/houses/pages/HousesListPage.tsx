import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ukApi } from '../../api';

export const HousesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  
  const { data: houses = [], isLoading } = useQuery({
    queryKey: ['uk-houses'],
    queryFn: ukApi.getHouses,
  });

  const filteredHouses = houses.filter((h) =>
    h.address.toLowerCase().includes(search.toLowerCase()) ||
    h.district.toLowerCase().includes(search.toLowerCase()) ||
    h.city.toLowerCase().includes(search.toLowerCase())
  );

  const selectedHouseId = localStorage.getItem('selected_house_id');

  const handleSelectHouse = (houseId: string | number) => {
    localStorage.setItem('selected_house_id', String(houseId));
    navigate(`/uk/dashboard?house=${houseId}`);
  };

  const totalApartments = houses.reduce((acc, h) => acc + (h.apartments_count || 0), 0);
  const totalResidents = houses.reduce((acc, h) => acc + (h.residents_count || 0), 0);
  const totalTickets = houses.reduce((acc, h) => acc + (h.active_tickets || 0), 0);

  const getWearBadge = (wear?: number | null) => {
    if (wear == null) return null;
    if (wear <= 20) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
          Износ {wear}% • Отличное
        </span>
      );
    }
    if (wear <= 40) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
          Износ {wear}% • Хорошее
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
        Износ {wear}% • Удовл.
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between antialiased selection:bg-blue-600/20">
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW87hzFCETfLDrLP_BvNfHMnt_dC26CaR9FPIB2wKmlhqm_cfgRW2dMnkhhOO-5RUjbT2nZvbOsOMPYsW7SMGE32aqsdjeipq2Bu_LCLYrS_yKZbogliHw3rzwsCDnoTNHtTogutbfCMopJOo6NiTedEOYpgSGQlpY5I1c41lPL6J1bhQc_wIWLbXxy0RCanUVuTonJ7IyKalWnvDFPKa9u0nwRbN5ydU-gk5YRmP4xivjcwXlr09abF9-95c4OxJO"
                alt="Мой Дом MAX"
                className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs shrink-0"
              />
              <div>
                <div className="flex items-center space-x-1.5 leading-none">
                  <span className="font-extrabold text-slate-900 tracking-tight text-base">МОЙ ДОМ</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
                  Кабинет Управляющей Организации
                </p>
              </div>
            </div>
            <div className="h-6 w-px bg-slate-200 hidden md:block" />
            <div className="hidden md:flex flex-col justify-center">
              <span className="text-xs font-bold text-slate-800">ООО УК «ЖилКомФорт»</span>
              <span className="text-[11px] text-slate-400">ИНН 1655389201 • Лицензия №016-00042</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate('/uk/dashboard')}
              className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-blue-200 shadow-xs"
            >
              <span>В общую панель</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center space-x-2.5 pl-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                ИД
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  Игорь Демьянов
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Главный диспетчер</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                Каталог жилого фонда
              </span>
              <span className="text-xs text-slate-400">ГИС ЖКХ синхронизировано</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Объекты в управлении (МКД)
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Выберите дом для перехода в диспетчерский журнал, управления голосованиями, публикации новостей или просмотра технического паспорта строения.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-slate-900 block leading-tight">{houses.length} МКД</span>
              <span className="text-xs text-slate-500 font-medium">Объектов в лицензии управляющей компании</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-emerald-600 block leading-tight">{totalResidents} / {totalApartments}</span>
              <span className="text-xs text-slate-500 font-medium">Жителей подключено к приложению MAX (78%)</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-slate-900 block leading-tight">{totalTickets}</span>
              <span className="text-xs text-slate-500 font-medium">Активных обращений на контроле</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по адресу, району или номеру дома..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
              Найдено: {filteredHouses.length} МКД
            </span>
          </div>
        </div>

        <section
          aria-label="Список объектов МКД"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {isLoading && (
            <div className="col-span-full text-center py-16 text-slate-400 text-xs">
              Загрузка каталога домов...
            </div>
          )}

          {filteredHouses.map((house) => {
            const isSelected = String(house.id) === selectedHouseId;

            return (
              <article
                key={house.id}
                className={`bg-white rounded-3xl p-6 shadow-xs flex flex-col justify-between relative transition-all duration-300 hover:shadow-lg border ${
                  isSelected ? 'border-2 border-blue-500 shadow-md ring-4 ring-blue-50' : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-3 left-6 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                    Активный выбор
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-xs ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-base font-bold text-slate-900 leading-snug truncate">
                          {house.address}
                        </h2>
                        <p className="text-xs text-slate-400 truncate">{house.city}, {house.district}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    {getWearBadge((house as any).wear_percentage)}
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 flex flex-col gap-2 mb-4 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Квартирография:</span>
                      <span className="font-bold text-slate-900">{house.apartments_count} квартир</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Жителей в приложении:</span>
                      <span className="font-bold text-blue-600">
                        {house.residents_count} чел. ({house.residents_percent}%)
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(house.residents_percent, 10)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-5">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase">Обращения</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                        {house.active_tickets} активных
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase">Опросы ОСС</span>
                      <span className="font-bold text-indigo-600 text-sm mt-0.5 block">
                        {house.active_polls > 0 ? `${house.active_polls} идет сбор` : 'Нет активных'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectHouse(house.id)}
                    className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                  >
                    <span>Войти в управление домом</span>
                    <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('selected_house_id', String(house.id));
                      navigate(`/uk/house-info`);
                    }}
                    className="w-full inline-flex items-center justify-center py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer text-slate-600 hover:bg-slate-50 border border-slate-200"
                  >
                    <span>Техпаспорт МКД и контакты служб</span>
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        <div className="bg-gradient-to-r from-slate-900 via-[#0d233a] to-[#004e75] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Подключение нового дома к платформе</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Импорт данных из ГИС ЖКХ, реестров Росреестра и генерация приглашений жильцам за 15 минут.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/uk/settings')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-md cursor-pointer"
            >
              Настройки УК и реквизиты
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        Платформа «Мой Дом MAX» • Информационная система управления многоквартирными домами
      </footer>
    </div>
  );
};
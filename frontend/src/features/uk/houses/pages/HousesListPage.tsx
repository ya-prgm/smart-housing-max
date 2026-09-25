import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HOUSES_DATA = [
  {
    id: '1',
    address: 'ул. Баумана, д. 12',
    district: 'Казань, Вахитовский район',
    apartments: 120,
    residents: 103,
    residentsPercent: 86,
    tickets: 3,
    polls: 1,
    posts: 2,
    isSelected: true,
  },
  {
    id: '2',
    address: 'ул. Флотская, д. 30',
    district: 'Казань, Кировский район',
    apartments: 84,
    residents: 76,
    residentsPercent: 91,
    tickets: 2,
    polls: 0,
    posts: 1,
    isSelected: false,
  },
  {
    id: '3',
    address: 'ул. Чистопольская, д. 65',
    district: 'Казань, Ново-Савиновский район',
    apartments: 210,
    residents: 155,
    residentsPercent: 74,
    tickets: 1,
    polls: 1,
    posts: 3,
    isSelected: false,
  },
  {
    id: '4',
    address: 'ул. Декабристов, д. 85',
    district: 'Казань, Московский район',
    apartments: 96,
    residents: 88,
    residentsPercent: 92,
    tickets: 0,
    polls: 0,
    posts: 0,
    isSelected: false,
  },
  {
    id: '5',
    address: 'пр-т Победы, д. 139',
    district: 'Казань, Советский район',
    apartments: 160,
    residents: 128,
    residentsPercent: 80,
    tickets: 4,
    polls: 1,
    posts: 1,
    isSelected: false,
  },
  {
    id: '6',
    address: 'ул. Пушкина, д. 42',
    district: 'Казань, Вахитовский район',
    apartments: 48,
    residents: 42,
    residentsPercent: 88,
    tickets: 0,
    polls: 0,
    posts: 0,
    isSelected: false,
  },
];

export const HousesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredHouses = HOUSES_DATA.filter((h) =>
    h.address.toLowerCase().includes(search.toLowerCase()) ||
    h.district.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectHouse = (houseId: string) => {
    localStorage.setItem('selected_house_id', houseId);
    navigate(`/uk/dashboard?house=${houseId}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between antialiased">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2.5">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW87hzFCETfLDrLP_BvNfHMnt_dC26CaR9FPIB2wKmlhqm_cfgRW2dMnkhhOO-5RUjbT2nZvbOsOMPYsW7SMGE32aqsdjeipq2Bu_LCLYrS_yKZbogliHw3rzwsCDnoTNHtTogutbfCMopJOo6NiTedEOYpgSGQlpY5I1c41lPL6J1bhQc_wIWLbXxy0RCanUVuTonJ7IyKalWnvDFPKa9u0nwRbN5ydU-gk5YRmP4xivjcwXlr09abF9-95c4OxJO"
                alt="Мой Дом MAX"
                className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs shrink-0"
              />
              <div>
                <div className="flex items-center space-x-1.5 leading-none">
                  <span className="font-bold text-slate-900 tracking-tight text-base">МОЙ ДОМ</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
                  Кабинет Управляющей Организации
                </p>
              </div>
            </div>
            <div className="h-6 w-px bg-slate-200 hidden md:block" />
            <div className="hidden md:flex flex-col justify-center">
              <span className="text-xs font-semibold text-slate-800">ООО УК «ЖилКомФорт»</span>
              <span className="text-[11px] text-slate-400">ИНН 1655389201 • Казань</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              aria-label="Уведомления"
              onClick={() => navigate('/notifications')}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 relative transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center space-x-3 pl-1">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-medium text-xs flex items-center justify-center ring-2 ring-slate-100">
                ИД
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  Игорь Демьянов
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs font-medium text-slate-500 hover:text-rose-600 px-2.5 py-1.5 rounded-md hover:bg-rose-50 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Выберите дом в управлении
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-2xl">
              В вашем ведении 6 объектов (МКД). Выберите нужный дом для перехода в диспетчерский
              журнал, публикации объявлений и опросов, либо перейдите в сводную аналитику.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 mb-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="relative flex-grow max-w-lg">
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
                placeholder="Поиск по адресу, номеру дома или улице..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap shadow-xs"
              >
                Все объекты ({filteredHouses.length})
              </button>
            </div>
          </div>
        </div>

        <section
          aria-label="Список объектов МКД"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredHouses.map((house) => (
            <article
              key={house.id}
              className={`bg-white rounded-2xl p-5 shadow-xs flex flex-col justify-between relative transition-all hover:shadow-md ${
                house.isSelected ? 'border-2 border-blue-500 shadow-md' : 'border border-slate-200 hover:border-slate-300'
              }`}
            >
              {house.isSelected && (
                <div className="absolute -top-3 left-5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                  Текущий выбранный
                </div>
              )}

              <div>
                <div className="flex items-start justify-between mb-3 mt-1">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        house.isSelected ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 leading-tight">
                        {house.address}
                      </h2>
                      <p className="text-xs text-slate-400">{house.district}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between mb-4 border border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Квартирография</span>
                    <span className="text-xs font-bold text-slate-700">{house.apartments} квартир</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">Жителей в приложении</span>
                    <span className={`text-xs font-bold ${house.isSelected ? 'text-blue-600' : 'text-slate-700'}`}>
                      {house.residents} жильцов ({house.residentsPercent}%)
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Обращения:</span>
                    </span>
                    <span className="font-semibold text-slate-700">{house.tickets} обращения</span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Опросы:</span>
                    </span>
                    <span className="font-semibold text-slate-700">
                      {house.polls > 0 ? `${house.polls} активный` : 'Нет активных'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-500 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Посты:</span>
                    </span>
                    <span className="font-medium text-slate-700">{house.posts} новых</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleSelectHouse(house.id)}
                  className={`w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    house.isSelected
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>Войти в управление домом</span>
                  <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </section>

        <div className="mt-10 bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 4v16m8-8H4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Добавить новый дом в систему управления</h3>
            </div>
          </div>
          <div className="flex items-center space-x-3 w-full md:w-auto shrink-0">
            <button
              type="button"
              className="w-full md:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs text-center cursor-pointer"
            >
              + Подключить МКД по лицензии
            </button>
            <button
              type="button"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium rounded-xl transition-colors text-center cursor-pointer"
            >
              Техподдержка
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-8 py-5" />
    </div>
  );
};
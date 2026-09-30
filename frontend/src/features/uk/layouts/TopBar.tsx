import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ukApi } from '../api';
import { useAuth } from '../../../shared/hooks/useAuth';

export const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isDashboard = location.pathname === '/uk/dashboard' || location.pathname === '/uk' || location.pathname === '/uk/';

  const { data: houses = [] } = useQuery({
    queryKey: ['uk-houses'],
    queryFn: ukApi.getHouses,
  });

  const selectedHouseId = localStorage.getItem('selected_house_id');
  const currentHouse = houses.find((h) => String(h.id) === selectedHouseId) || houses[0];

  const getPageTitle = (path: string) => {
    if (path.includes('/uk/house-info')) return 'Паспорт и характеристики дома';
    if (path.includes('/uk/tickets')) return 'Реестр обращений жителей';
    if (path.includes('/uk/votes/new')) return 'Конструктор нового опроса';
    if (path.includes('/uk/votes')) return 'Опросы и голосования собственников';
    if (path.includes('/uk/residents')) return 'Реестр квартир и жителей';
    if (path.includes('/uk/feed')) return 'Публикация новостей в ленту';
    if (path.includes('/uk/documents')) return 'Электронный архив документов МКД';
    if (path.includes('/uk/settings')) return 'Параметры и реквизиты организации';
    return 'Главная панель управления';
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {isDashboard ? (
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Поиск по публикациям, жильцам, квартирам и заявкам..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Кабинет УК</span>
            <span className="text-slate-300">/</span>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              {getPageTitle(location.pathname)}
            </h1>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {currentHouse && (
          <button
            type="button"
            onClick={() => navigate('/uk/houses')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/90 text-xs font-semibold text-slate-700 transition cursor-pointer group shadow-xs"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <span className="truncate max-w-[180px] font-medium text-slate-800">{currentHouse.address}</span>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-bold border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition">
              Сменить
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => navigate('/uk/feed')}
          className="hidden md:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <span>Опубликовать</span>
        </button>

        <button
          type="button"
          aria-label="Уведомления"
          onClick={() => navigate('/notifications')}
          className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 relative transition-colors cursor-pointer"
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

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        <div className="relative pl-1" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-slate-100 transition cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user?.full_name ? user.full_name.slice(0, 2).toUpperCase() : 'ИД'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {user?.full_name || 'Игорь Демьянов'}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Главный диспетчер УК</div>
            </div>
            <span className={`material-symbols-outlined text-[18px] text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180 text-blue-600' : ''}`}>
              expand_more
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="font-bold text-xs text-slate-900">
                  {user?.full_name || 'Игорь Демьянов'}
                </div>
                <div className="text-[11px] text-blue-600 font-medium mt-0.5">
                  ООО УК «ЖилКомФорт»
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Лицензия ГЖИ №016-004128
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/uk/settings');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-400">settings</span>
                  <span>Настройки и реквизиты</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/uk/houses');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-400">apartment</span>
                  <span>Объекты в управлении</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/uk/house-info');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-400">info</span>
                  <span>Паспорт активного дома</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition cursor-pointer font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px] text-rose-500">logout</span>
                  <span>Выйти из профиля</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

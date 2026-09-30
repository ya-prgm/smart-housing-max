import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ukApi } from '../api';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const { data: dashboardStats } = useQuery({
    queryKey: ['uk-dashboard'],
    queryFn: ukApi.getDashboard,
  });

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 shrink-0 z-30 select-none">
      <div>
        <div className="px-5 py-4 border-b border-slate-200/80 flex items-center space-x-2.5">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW87hzFCETfLDrLP_BvNfHMnt_dC26CaR9FPIB2wKmlhqm_cfgRW2dMnkhhOO-5RUjbT2nZvbOsOMPYsW7SMGE32aqsdjeipq2Bu_LCLYrS_yKZbogliHw3rzwsCDnoTNHtTogutbfCMopJOo6NiTedEOYpgSGQlpY5I1c41lPL6J1bhQc_wIWLbXxy0RCanUVuTonJ7IyKalWnvDFPKa9u0nwRbN5ydU-gk5YRmP4xivjcwXlr09abF9-95c4OxJO"
            alt="Мой Дом MAX"
            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 leading-none">
              <span className="font-bold text-slate-900 tracking-tight text-base">МОЙ ДОМ</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5 truncate">
              Кабинет Управляющей Организации
            </p>
          </div>
        </div>

        <div className="p-3 mx-3 my-3 bg-slate-50 rounded-2xl border border-slate-200/90 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0 border border-blue-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div className="overflow-hidden flex-1">
            <div className="font-bold text-xs text-slate-900 truncate">ООО УК «ЖилКомФорт»</div>
            <div className="text-[11px] font-medium text-slate-400 truncate">ИНН 1655389201 • Казань</div>
          </div>
        </div>

        <nav className="px-3 space-y-1">
          <NavLink
            to="/uk/dashboard"
            className={({ isActive }) =>
              `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-100 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <div className="flex items-center gap-3">
                <svg className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} fill={isActive ? 'currentColor' : 'none'} stroke={isActive ? 'none' : 'currentColor'} viewBox="0 0 24 24">
                  {isActive ? (
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  )}
                </svg>
                <span>Главная</span>
              </div>
            )}
          </NavLink>

          <NavLink
            to="/uk/house-info"
            className={({ isActive }) =>
              `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-100 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <div className="flex items-center gap-3">
                <svg className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                <span>О доме</span>
              </div>
            )}
          </NavLink>

          <NavLink
            to="/uk/tickets"
            className={({ isActive }) =>
              `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-100 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <svg className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  <span>Обращения жителей</span>
                </div>
                {dashboardStats && (
                  <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-xs">
                    {dashboardStats.active_tickets}
                  </span>
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/uk/votes"
            className={({ isActive }) =>
              `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-100 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <svg className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  <span>Опросы</span>
                </div>
                {dashboardStats && dashboardStats.active_polls > 0 && (
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {dashboardStats.active_polls}
                  </span>
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/uk/residents"
            className={({ isActive }) =>
              `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-100 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <div className="flex items-center gap-3">
                <svg className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span>Реестр квартир</span>
              </div>
            )}
          </NavLink>

          <NavLink
            to="/uk/documents"
            className={({ isActive }) =>
              `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-100 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <div className="flex items-center gap-3">
                <svg className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span>Документы и отчеты</span>
              </div>
            )}
          </NavLink>

          <NavLink
            to="/uk/settings"
            className={({ isActive }) =>
              `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-100 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <div className="flex items-center gap-3">
                <svg className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span>Настройки</span>
              </div>
            )}
          </NavLink>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => navigate('/uk/houses')}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          <span>Выйти в выбор домов</span>
        </button>
      </div>
    </aside>
  );
};

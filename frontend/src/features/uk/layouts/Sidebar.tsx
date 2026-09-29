import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/uk/dashboard', icon: 'dashboard', label: 'Дашборд' },
    { to: '/uk/houses', icon: 'apartment', label: 'Дома в управлении' },
    { to: '/uk/tickets', icon: 'confirmation_number', label: 'Реестр заявок' },
    { to: '/uk/residents', icon: 'group', label: 'Реестр жителей' },
    { to: '/uk/votes', icon: 'how_to_vote', label: 'Опросы и ОСС' },
    { to: '/uk/feed', icon: 'campaign', label: 'Новости и посты' },
    { to: '/uk/documents', icon: 'folder_open', label: 'Документы' },
    { to: '/uk/journal', icon: 'history', label: 'Журнал действий' },
    { to: '/uk/settings', icon: 'settings', label: 'Настройки УК' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 shrink-0 z-30 select-none">
      <div>
        <div className="px-5 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-primary flex items-center justify-center text-white shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[22px]">corporate_fare</span>
          </div>
          <div className="min-w-0">
            <span className="font-extrabold text-[16px] tracking-tight text-slate-900 block leading-tight truncate">
              МОЙ ДОМ
            </span>
            <span className="text-[11px] text-slate-400 font-medium block truncate">
              Кабинет управления МКД
            </span>
          </div>
        </div>

        <nav className="p-3 flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-160px)]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white font-semibold shadow-xs shadow-primary/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-3 border-t border-slate-100 flex flex-col gap-2">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50">
          <div className="w-8 h-8 rounded-full bg-sky-100 text-primary flex items-center justify-center text-[12px] font-bold shrink-0">
            {user?.full_name?.charAt(0) || 'У'}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[12px] font-semibold text-slate-800 truncate">
              {user?.full_name || 'Диспетчер УК'}
            </span>
            <span className="text-[10px] text-slate-400 truncate">
              Сотрудник УК
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Выйти из кабинета</span>
        </button>
      </div>
    </aside>
  );
};

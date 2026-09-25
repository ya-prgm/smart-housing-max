import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export const MobileLayout: React.FC = () => {
  const navItems = [
    { to: '/feed', icon: 'newspaper', label: 'Лента' },
    { to: '/tickets', icon: 'assignment', label: 'Обращения' },
    { to: '/votes', icon: 'how_to_vote', label: 'Опросы' },
    { to: '/profile', icon: 'account_circle', label: 'Профиль' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center selection:bg-primary/20">
      <div className="w-full max-w-[430px] min-h-screen bg-surface flex flex-col relative shadow-2xl overflow-x-hidden">
        <main className="flex-1 pb-20">
          <Outlet />
        </main>
        
        <nav className="fixed bottom-0 max-w-[430px] w-full bg-white/90 backdrop-blur-lg border-t border-slate-200/80 px-4 py-2 z-40 pb-safe">
          <div className="flex justify-around items-center">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center w-16 py-1 transition-colors ${
                    isActive ? 'text-secondary font-semibold' : 'text-on-surface-variant hover:text-secondary'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[24px] mb-0.5">
                  {item.icon}
                </span>
                <span className="text-[11px] leading-none tracking-tight">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};
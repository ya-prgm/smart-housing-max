import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  {
    path: '/chairman/tickets',
    label: 'Обращения',
    icon: 'inbox',
    activeIcon: 'inbox',
  },
  {
    path: '/chairman/feed',
    label: 'Лента',
    icon: 'article',
    activeIcon: 'article',
  },
  {
    path: '/chairman/polls',
    label: 'Опросы',
    icon: 'how_to_vote',
    activeIcon: 'how_to_vote',
  },
  {
    path: '/chairman/profile',
    label: 'Профиль',
    icon: 'person',
    activeIcon: 'person',
  },
];

export const ChairmanLayout: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-[#f0f4ff] relative flex flex-col shadow-2xl overflow-x-hidden">
        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>

        {/* Bottom navigation */}
        <nav
          className="fixed bottom-0 max-w-[430px] w-full z-50 pb-safe"
          style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(0,0,0,0.08)' }}
        >
          <div className="flex items-end justify-around px-2 pt-2 pb-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-1 px-3 py-1 min-w-[60px] cursor-pointer group"
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div
                    className={`flex items-center justify-center w-12 h-7 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-100'
                        : 'group-hover:bg-slate-100'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[22px] transition-all duration-200 ${
                        isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                      style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {isActive ? item.activeIcon : item.icon}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold leading-none transition-colors duration-200 ${
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

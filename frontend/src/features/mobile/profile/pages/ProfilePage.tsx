import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { UserCard } from '../components/UserCard';
import { UtilityCard } from '../components/UtilityCard';
import { Skeleton } from '../../../../shared/ui/Skeleton';
import { APP_LOGO_SRC } from '../../../../shared/constants/branding';
import { useUnreadNotifications } from '../../../../shared/hooks/useUnreadNotifications';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, isLoading } = useProfile();
  const { hasUnread } = useUnreadNotifications();

  return (
    <div className="flex flex-col w-full relative min-h-screen">
      <header className="sticky top-0 w-full z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all">
        <div className="px-4 pt-2.5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={APP_LOGO_SRC}
              alt="Мой Дом"
              className="w-8 h-8 rounded-full object-contain bg-white shadow-xs border border-slate-200/80 shrink-0"
            />
            <span className="text-[17px] font-bold text-slate-900 tracking-tight">МОЙ ДОМ</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="relative">
              <button
                type="button"
                aria-label="Уведомления"
                onClick={() => navigate('/notifications')}
                className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 active:scale-95 border border-slate-200/60 flex items-center justify-center text-slate-600 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white pointer-events-none" />
              )}
            </div>
            <button
              type="button"
              aria-label="Настройки"
              onClick={() => navigate('/profile/settings')}
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-600 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full px-4 pt-4 pb-28">
        <div className="w-full max-w-md flex flex-col gap-4">
          {isLoading || !profile ? (
            <div className="flex flex-col gap-4 w-full">
              <Skeleton className="h-64 w-full rounded-3xl" />
              <Skeleton className="h-24 w-full rounded-3xl" />
              <Skeleton className="h-44 w-full rounded-3xl" />
            </div>
          ) : (
            <>
              <UserCard profile={profile} />

              <div
                role="button"
                tabIndex={0}
                onClick={() => navigate('/profile/house')}
                className="w-full bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card flex items-center justify-between hover:bg-sky-50/40 active:scale-[0.99] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-50 to-blue-50 border border-slate-200/60 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">domain</span>
                  </div>
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-[16px] font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
                      О доме
                    </span>
                    <span className="text-[12px] text-slate-500 leading-tight truncate">
                      Паспорт дома, конструктив, управляющая организация, совет МКД
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all">
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </div>
              </div>

              <UtilityCard
                debtAmount={profile.debt_amount ?? 0}
                isDebtFree={profile.is_debt_free ?? true}
              />

              <div
                role="button"
                tabIndex={0}
                onClick={() => navigate('/profile/settings')}
                className="w-full bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card flex items-center justify-between hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-sky-50 group-hover:text-primary transition-colors shrink-0">
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[15px] font-semibold text-slate-900 group-hover:text-primary transition-colors">
                      Настройки
                    </span>
                    <span className="text-[12px] text-slate-500">Безопасность, PIN-код, уведомления</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
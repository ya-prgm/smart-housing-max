import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../../../../shared/hooks/useAuth';
import { useToast } from '../../../../shared/hooks/useToast';
import { SettingsRow } from '../components/SettingsRow';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { LogoutModal } from '../components/LogoutModal';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, isUpdating } = useProfile();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState(
    profile?.notifications_enabled ?? true
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleToggleNotifications = async (checked: boolean) => {
    setNotifications(checked);
    try {
      await updateProfile({ notifications_enabled: checked });
      showToast(
        checked ? 'Уведомления включены' : 'Уведомления отключены',
        'info'
      );
    } catch {
      setNotifications(!checked);
      showToast('Не удалось обновить настройку', 'error');
    }
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="bg-[#f7f9ff] text-slate-900 min-h-screen flex flex-col relative select-none pb-24">
      <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 pt-safe">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Назад"
              onClick={() => navigate(-1)}
              className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight">
              Настройки
            </h1>
          </div>
        </div>
      </header>

      <main className="px-4 pt-4 flex flex-col gap-4 max-w-[430px] mx-auto w-full">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
              Оповещения и связь
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            <SettingsRow
              icon="notifications"
              title="Push-уведомления"
              subtitle="О статусах заявок, опросах и новостях"
              rightElement={
                <ToggleSwitch
                  checked={notifications}
                  onChange={handleToggleNotifications}
                  disabled={isUpdating}
                />
              }
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
              Безопасность и аккаунт
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            <SettingsRow
              icon="pin"
              title="Сменить PIN-код"
              subtitle="Для быстрого входа в приложение"
              onClick={() => navigate('/auth/pin-setup')}
            />

            <SettingsRow
              icon="verified_user"
              title="Госуслуги (ЕСИА)"
              subtitle={profile?.esia_linked ? 'Подключено' : 'Синхронизировано через MAX'}
              rightElement={
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100">
                  Активно
                </span>
              }
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
              О приложении
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            <SettingsRow
              icon="info"
              title="Версия приложения"
              subtitle="1.0.0 (MAX MiniApp Hackathon 2026)"
            />
            <SettingsRow
              icon="description"
              title="Пользовательское соглашение"
              onClick={() => showToast('Соглашение принято при авторизации', 'info')}
            />
            <SettingsRow
              icon="logout"
              title="Выйти из профиля"
              destructive
              onClick={() => setShowLogoutModal(true)}
            />
          </div>
        </div>
      </main>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

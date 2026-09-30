import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../../../../shared/hooks/useAuth';
import { useToast } from '../../../../shared/hooks/useToast';
import { useHaptic } from '../../../../shared/hooks/useHaptic';
import { SettingsRow } from '../components/SettingsRow';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { LogoutModal } from '../components/LogoutModal';
import { Spinner } from '../../../../shared/ui/Spinner';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, isUpdating, syncEsia, isSyncingEsia } = useProfile();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const { impact, notification } = useHaptic();

  const [notifications, setNotifications] = useState(
    profile?.notifications_enabled ?? true
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [isEditingContacts, setIsEditingContacts] = useState(false);
  const [phoneInput, setPhoneInput] = useState(profile?.phone || '');
  const [emailInput, setEmailInput] = useState(profile?.email || '');
  const [nameInput, setNameInput] = useState(profile?.full_name || '');

  useEffect(() => {
    if (profile) {
      setNotifications(profile.notifications_enabled ?? true);
      setPhoneInput(profile.phone || '');
      setEmailInput(profile.email || '');
      setNameInput(profile.full_name || '');
    }
  }, [profile]);

  const handleToggleNotifications = async (checked: boolean) => {
    setNotifications(checked);
    try {
      await updateProfile({ notifications_enabled: checked });
      impact('light');
      showToast(
        checked ? 'Push-уведомления включены' : 'Push-уведомления отключены',
        'info'
      );
    } catch {
      setNotifications(!checked);
      showToast('Не удалось обновить настройку', 'error');
    }
  };

  const handleSaveContacts = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      impact('medium');
      await updateProfile({
        full_name: nameInput.trim() || undefined,
        phone: phoneInput.trim() || null,
        email: emailInput.trim() || null,
      });
      setIsEditingContacts(false);
      notification('success');
      showToast('Контактные данные успешно сохранены', 'success');
    } catch {
      notification('error');
      showToast('Не удалось сохранить изменения', 'error');
    }
  };

  const handleSyncEsia = async () => {
    try {
      impact('medium');
      await syncEsia();
      notification('success');
      showToast('Данные ЕСИА успешно синхронизированы с Госуслугами', 'success');
    } catch {
      notification('error');
      showToast('Ошибка синхронизации с Госуслугами', 'error');
    }
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="bg-[#f7f9ff] text-slate-900 min-h-screen flex flex-col relative select-none pb-24">
      <header className="sticky top-0 w-full z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all">
        <div className="px-4 pt-2.5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Назад"
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
              Настройки
            </h1>
          </div>
        </div>
      </header>

      <main className="px-4 pt-4 flex flex-col gap-4 max-w-[430px] mx-auto w-full">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
              Личные данные
            </h2>
            <button
              type="button"
              onClick={() => setIsEditingContacts(!isEditingContacts)}
              className="text-[12px] font-semibold text-primary hover:underline cursor-pointer"
            >
              {isEditingContacts ? 'Отмена' : 'Редактировать'}
            </button>
          </div>

          {isEditingContacts ? (
            <form onSubmit={handleSaveContacts} className="p-4 flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  ФИО
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:outline-none text-[14px]"
                  placeholder="Фамилия Имя Отчество"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Номер телефона
                </label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:outline-none text-[14px]"
                  placeholder="+7 (999) 000-00-00"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Электронная почта
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:outline-none text-[14px]"
                  placeholder="user@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="mt-2 w-full h-11 rounded-xl bg-primary text-white font-semibold text-[13px] flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                {isUpdating ? (
                  <Spinner size="sm" className="text-white" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">check</span>
                    <span>Сохранить</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="divide-y divide-slate-100">
              <SettingsRow
                icon="badge"
                title="ФИО"
                subtitle={profile?.full_name || 'Не указано'}
              />
              <SettingsRow
                icon="call"
                title="Телефон"
                subtitle={profile?.phone || 'Не указан'}
              />
              <SettingsRow
                icon="mail"
                title="Email"
                subtitle={profile?.email || 'Не указан'}
              />
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
              Оповещения
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            <SettingsRow
              icon="notifications"
              title="Push-уведомления"
              subtitle="О статусах заявок, голосованиях и новостях дома"
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
              Безопасность и ЕСИА
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            <SettingsRow
              icon="pin"
              title="Сменить PIN-код"
              subtitle="Для быстрого входа в приложение"
              onClick={() => navigate('/auth/pin-setup')}
            />

            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[14px] font-semibold text-slate-900 leading-tight">
                    Госуслуги (ЕСИА)
                  </span>
                  <span className="text-[12px] text-slate-500">
                    {profile?.snils ? `СНИЛС: ${profile.snils}` : 'Интеграция активна'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={isSyncingEsia}
                onClick={handleSyncEsia}
                className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold hover:bg-blue-100 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
              >
                {isSyncingEsia ? (
                  <Spinner size="sm" className="text-blue-700" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[14px]">sync</span>
                    <span>Обновить</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
              О сервисе
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
              onClick={() => setShowTermsModal(true)}
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

      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-[16px] font-bold text-slate-900">
                Пользовательское соглашение
              </h3>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="text-[12px] text-slate-600 leading-relaxed flex flex-col gap-2">
              <p>
                1. Сервис «Мой Дом MAX» предоставляет собственникам и жильцам многоквартирных домов доступ к цифровому паспорту дома, голосованиям общего собрания собственников (ОСС) и взаимодействию с управляющей организацией.
              </p>
              <p>
                2. Авторизация и идентификация осуществляются через защищённый протокол мессенджера MAX и государственную единую систему идентификации и аутентификации (ЕСИА/Госуслуги).
              </p>
              <p>
                3. Обработка персональных данных соответствует Федеральному закону РФ № 152-ФЗ «О персональных данных».
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowTermsModal(false)}
              className="w-full h-11 rounded-2xl bg-primary text-white font-semibold text-[13px] hover:bg-primary/90 transition-all cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

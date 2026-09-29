import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../mobile/profile/hooks/useProfile';

export const ChairmanProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, isLoading } = useProfile();

  const menuItems = [
    {
      id: 'settings',
      label: 'Настройки аккаунта',
      icon: 'settings',
      onClick: () => navigate('/profile/settings'),
    },
    {
      id: 'house-info',
      label: 'Информация о доме',
      icon: 'apartment',
      onClick: () => navigate('/profile/house-info'),
    },
    {
      id: 'docs',
      label: 'Документы ТСЖ',
      icon: 'folder_open',
      onClick: () => navigate('/profile/documents'),
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen pb-28 bg-[#f0f4ff] text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 pt-safe bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-sm">
        <div className="h-14 px-4 flex items-center justify-between">
          <span className="text-[17px] font-bold text-slate-900">Мой профиль</span>
          <button
            type="button"
            onClick={() => navigate('/profile/settings')}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer hover:bg-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
        </div>
      </header>

      <div className="px-4 pt-5 pb-6 flex flex-col gap-5">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <div className="h-48 bg-white rounded-2xl animate-pulse" />
            <div className="h-32 bg-white rounded-2xl animate-pulse" />
          </div>
        ) : (
          <>
            {/* Chairman Hero Card */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              {/* BG decoration */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-xl" />
              <div className="absolute -bottom-6 -left-4 w-24 h-24 rounded-full bg-purple-400/20 blur-xl" />

              {/* Badge */}
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">shield_person</span>
                </div>
                <span className="text-[13px] font-bold text-white/90 bg-white/15 px-3 py-1 rounded-full">
                  Председатель ТСЖ
                </span>
              </div>

              {/* User info */}
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black text-[22px] border-2 border-white/30">
                  {profile?.full_name?.charAt(0) || 'П'}
                </div>
                <div>
                  <h1 className="text-[19px] font-black leading-tight">
                    {profile?.full_name || 'Председатель'}
                  </h1>
                  <p className="text-[13px] text-white/70 mt-0.5">
                    {profile?.apartment_number ? `Кв. ${profile.apartment_number}` : ''} {profile?.house_address || ''}
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex gap-3 mt-4 relative z-10">
                <div className="flex-1 bg-white/15 rounded-xl p-3 text-center">
                  <div className="text-[18px] font-black">ТСЖ</div>
                  <div className="text-[10px] text-white/70">Организация</div>
                </div>
                <div className="flex-1 bg-white/15 rounded-xl p-3 text-center">
                  <div className="text-[18px] font-black">∞</div>
                  <div className="text-[10px] text-white/70">Привилегий</div>
                </div>
                <div className="flex-1 bg-white/15 rounded-xl p-3 text-center">
                  <div className="text-[18px] font-black">PRO</div>
                  <div className="text-[10px] text-white/70">Доступ</div>
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
              <h2 className="text-[13px] font-bold text-slate-700">Контактные данные</h2>
              {profile?.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px] text-blue-600">phone</span>
                  </div>
                  <div>
                    <div className="text-[12px] text-slate-400">Телефон</div>
                    <div className="text-[14px] font-semibold text-slate-900">{profile.phone}</div>
                  </div>
                </div>
              )}
              {profile?.email && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px] text-purple-600">email</span>
                  </div>
                  <div>
                    <div className="text-[12px] text-slate-400">Email</div>
                    <div className="text-[14px] font-semibold text-slate-900">{profile.email}</div>
                  </div>
                </div>
              )}
              {!profile?.phone && !profile?.email && (
                <p className="text-[13px] text-slate-400">Контактные данные не заполнены</p>
              )}
            </div>

            {/* Menu */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {menuItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer ${
                    idx < menuItems.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px] text-indigo-600">{item.icon}</span>
                  </div>
                  <span className="flex-1 text-[14px] font-medium text-slate-800">{item.label}</span>
                  <span className="material-symbols-outlined text-[18px] text-slate-300">chevron_right</span>
                </button>
              ))}
            </div>

            {/* Chairman permissions */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[18px] text-indigo-600">verified</span>
                <span className="text-[13px] font-bold text-indigo-800">Права председателя</span>
              </div>
              {[
                'Публикация постов для жильцов',
                'Ответы на обращения и смена статуса',
                'Создание опросов и просмотр результатов',
                'Полный доступ к обращениям дома',
              ].map((perm) => (
                <div key={perm} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px] text-emerald-600">check</span>
                  <span className="text-[12px] text-indigo-700">{perm}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

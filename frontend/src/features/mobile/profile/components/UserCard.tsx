import React from 'react';
import { UserProfile } from '../../../../shared/types/user';
import { AccountCopy } from './AccountCopy';
import { formatPhone } from '../../../../shared/lib/formatPhone';

interface UserCardProps {
  profile: UserProfile;
}

export const UserCard: React.FC<UserCardProps> = ({ profile }) => {
  const getInitials = (name?: string) => {
    if (!name) return 'Ж';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    if (role === 'chairman') return 'Председатель совета МКД';
    if (role === 'uk_staff') return 'Сотрудник УК';
    return 'Собственник';
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card flex flex-col items-center text-center w-full">
      <div className="relative shrink-0 mb-3">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#006591] via-[#0088cc] to-[#2aabee] flex items-center justify-center text-white font-bold text-[24px] shadow-md tracking-wider">
          {getInitials(profile.full_name)}
        </div>
        {(profile.esia_linked || profile.snils) && (
          <div
            title="Подтверждено через Госуслуги"
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-white shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">verified</span>
          </div>
        )}
      </div>

      <h1 className="text-xl font-bold text-slate-900 leading-tight mb-2">
        {profile.full_name}
      </h1>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#006591] text-[12px] font-semibold mb-3">
        <span className="material-symbols-outlined text-[14px]">home</span>
        <span>
          {getRoleLabel(profile.role)}
          {profile.apartment_number ? ` • кв. ${profile.apartment_number}` : ''}
        </span>
      </div>

      {profile.house_address && (
        <div className="flex items-center justify-center gap-1 text-[13px] text-slate-500 mb-3 text-center px-2">
          <span className="material-symbols-outlined text-[16px] text-slate-400 shrink-0">
            location_on
          </span>
          <span>{profile.house_address}</span>
        </div>
      )}

      {profile.personal_account && (
        <div className="mb-3">
          <AccountCopy accountNumber={profile.personal_account} />
        </div>
      )}

      <div className="w-full flex flex-col gap-2 pt-3 border-t border-slate-100">
        {(profile.esia_linked || profile.snils) && (
          <div className="w-full p-2.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-left">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-blue-600">
                security
              </span>
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-blue-900 leading-tight">
                  Госуслуги (ЕСИА) подтверждены
                </span>
                {profile.snils && (
                  <span className="text-[11px] text-blue-700">
                    СНИЛС: {profile.snils}
                  </span>
                )}
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-blue-600">
              check_circle
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-left">
          {profile.phone && (
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Телефон
              </span>
              <span className="text-[12px] font-semibold text-slate-800 truncate mt-0.5">
                {formatPhone(profile.phone)}
              </span>
            </div>
          )}

          {profile.email && (
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Email
              </span>
              <span className="text-[12px] font-semibold text-slate-800 truncate mt-0.5">
                {profile.email}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

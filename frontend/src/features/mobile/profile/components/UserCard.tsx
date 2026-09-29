import React from 'react';
import { UserProfile } from '../../../../shared/types/user';
import { AccountCopy } from './AccountCopy';

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
        <AccountCopy accountNumber={profile.personal_account} />
      )}
    </div>
  );
};

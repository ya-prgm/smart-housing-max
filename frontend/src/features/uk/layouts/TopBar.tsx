import React from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';

interface TopBarProps {
  title?: string;
  selectedHouseAddress?: string;
  onSelectHouseAddress?: (address: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title = 'Панель управления',
  selectedHouseAddress = 'ул. Баумана, д. 12',
}) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 select-none">
      <div className="flex items-center gap-4">
        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-[12px] text-slate-600">
          <span className="material-symbols-outlined text-[16px] text-primary">apartment</span>
          <span>{selectedHouseAddress}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-sky-100 text-primary flex items-center justify-center text-[12px] font-bold">
            {user?.full_name?.charAt(0) || 'У'}
          </div>
          <span className="text-[13px] font-semibold text-slate-800 hidden sm:inline">
            {user?.full_name || 'Диспетчер'}
          </span>
        </div>
      </div>
    </header>
  );
};

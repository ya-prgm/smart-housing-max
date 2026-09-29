import React from 'react';
import { HouseServiceProviderResponse } from '../../../../shared/types/house';
import { formatPhone } from '../../../../shared/lib/formatPhone';

interface RsoListProps {
  providers: HouseServiceProviderResponse[];
  dispatcherPhone?: string | null;
  emergencyPhone?: string | null;
}

export const RsoList: React.FC<RsoListProps> = ({
  providers,
  dispatcherPhone,
  emergencyPhone,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'water':
        return 'water_drop';
      case 'heating':
        return 'mode_heat';
      case 'electricity':
        return 'bolt';
      case 'gas':
        return 'local_fire_department';
      case 'waste':
        return 'delete';
      case 'intercom':
        return 'call';
      case 'elevator':
        return 'elevator';
      default:
        return 'corporate_fare';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[19px]">contact_phone</span>
        </div>
        <h3 className="text-[15px] font-bold text-slate-900">
          Службы и ресурсоснабжающие организации
        </h3>
      </div>

      <div className="flex flex-col gap-2">
        {emergencyPhone && (
          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <span className="material-symbols-outlined text-[18px]">emergency</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-slate-900">
                  Аварийно-диспетчерская служба
                </span>
                <span className="text-[11px] text-slate-500">Круглосуточно</span>
              </div>
            </div>
            <a
              href={`tel:${emergencyPhone}`}
              className="text-[13px] font-bold text-rose-600 hover:underline"
            >
              {formatPhone(emergencyPhone)}
            </a>
          </div>
        )}

        {dispatcherPhone && (
          <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[18px]">support_agent</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-slate-900">Диспетчер УК</span>
                <span className="text-[11px] text-slate-500">Приём заявок</span>
              </div>
            </div>
            <a
              href={`tel:${dispatcherPhone}`}
              className="text-[13px] font-bold text-primary hover:underline"
            >
              {formatPhone(dispatcherPhone)}
            </a>
          </div>
        )}

        {providers.map((p) => (
          <div
            key={p.id}
            className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <span className="material-symbols-outlined text-[18px]">
                  {getCategoryIcon(p.category)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-slate-800">
                  {p.name}
                </span>
                <span className="text-[11px] text-slate-400">
                  {p.service_description}
                </span>
              </div>
            </div>

            {p.phone && (
              <a
                href={`tel:${p.phone}`}
                className="text-[12px] font-semibold text-primary hover:underline"
              >
                {formatPhone(p.phone)}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

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
      case 'internet':
      case 'telecom':
        return 'wifi';
      default:
        return 'corporate_fare';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-2xl bg-sky-100 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[20px]">contact_phone</span>
        </div>
        <div>
          <h3 className="text-[16px] font-bold text-slate-900 leading-tight">
            Службы и ресурсоснабжающие организации
          </h3>
          <p className="text-[11px] text-slate-400">
            Прямые контакты поставщиков коммунальных услуг
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {emergencyPhone && (
          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <span className="material-symbols-outlined text-[20px]">emergency</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-slate-900">
                  Аварийная служба
                </span>
                <span className="text-[11px] text-rose-600 font-medium">Круглосуточно • 24/7</span>
              </div>
            </div>
            <a
              href={`tel:${emergencyPhone}`}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-[12px] font-bold flex items-center gap-1.5 shadow-xs hover:bg-rose-700 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[15px]">call</span>
              <span>{formatPhone(emergencyPhone)}</span>
            </a>
          </div>
        )}

        {dispatcherPhone && (
          <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-slate-900">Диспетчер УК</span>
                <span className="text-[11px] text-primary font-medium">Приём заявок жителей</span>
              </div>
            </div>
            <a
              href={`tel:${dispatcherPhone}`}
              className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-[12px] font-bold flex items-center gap-1.5 shadow-xs hover:bg-primary/90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[15px]">call</span>
              <span>{formatPhone(dispatcherPhone)}</span>
            </a>
          </div>
        )}

        {providers.map((p) => (
          <div
            key={p.id}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-slate-200/70 flex items-center justify-center text-slate-600 shrink-0">
                <span className="material-symbols-outlined text-[18px]">
                  {getCategoryIcon(p.category)}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[13px] font-bold text-slate-800 truncate">
                    {p.name}
                  </span>
                  {p.brand_badge && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-100/70 text-primary text-[10px] font-bold">
                      {p.brand_badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 truncate">
                  {p.service_description}
                </span>
              </div>
            </div>

            {p.phone && (
              <a
                href={`tel:${p.phone}`}
                className="shrink-0 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-primary text-[12px] font-bold flex items-center gap-1 hover:bg-sky-50 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[15px]">call</span>
                <span className="hidden sm:inline">{formatPhone(p.phone)}</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

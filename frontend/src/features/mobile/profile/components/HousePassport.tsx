import React from 'react';
import { HouseDetailResponse } from '../../../../shared/types/house';

interface HousePassportProps {
  house: HouseDetailResponse;
}

export const HousePassport: React.FC<HousePassportProps> = ({ house }) => {
  const getWearBadge = (wear?: number | null) => {
    if (wear == null) return null;
    if (wear <= 20) {
      return (
        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
          Отличное ({wear}%)
        </span>
      );
    }
    if (wear <= 40) {
      return (
        <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[10px] font-bold border border-sky-100">
          Хорошее ({wear}%)
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100">
        Удовлетворительное ({wear}%)
      </span>
    );
  };

  const generalItems = [
    { label: 'Год постройки', value: house.year_built ? `${house.year_built} г.` : '—' },
    { label: 'Этажность', value: house.floors ? `${house.floors} эт.` : '—' },
    { label: 'Подъездов', value: house.entrances ? String(house.entrances) : '—' },
    { label: 'Квартир', value: house.apartments_count ? String(house.apartments_count) : '—' },
    {
      label: 'Физический износ',
      value: house.wear_percentage != null ? `${house.wear_percentage}%` : '—',
      badge: getWearBadge(house.wear_percentage),
    },
    { label: 'Материал стен', value: house.wall_material || 'Кирпич' },
    { label: 'Серия проекта', value: house.project_series || 'Индивидуальный' },
  ];

  const areaItems = [
    {
      label: 'Общая площадь',
      value: house.total_area ? `${Number(house.total_area).toLocaleString('ru-RU')} м²` : '—',
    },
    {
      label: 'Жилая площадь',
      value: house.living_area ? `${Number(house.living_area).toLocaleString('ru-RU')} м²` : '—',
    },
  ];

  const managementItems = [
    { label: 'Способ управления', value: house.management_type || 'Управляющая организация' },
    { label: 'Управляющая организация', value: house.uk_name || 'УК' },
    { label: 'ИНН организации', value: house.uk_inn || '—' },
    { label: 'Председатель совета МКД', value: house.chairman_name || '—' },
  ];

  const registryItems = [
    { label: 'Кадастровый номер', value: house.cadastral_number || '—' },
    { label: 'Код ФИАС', value: house.fias_code || '—' },
    { label: 'Код ОКТМО', value: house.oktmo || '—' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card flex flex-col gap-5 w-full">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-2xl bg-sky-100 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[20px]">home_work</span>
        </div>
        <div>
          <h3 className="text-[16px] font-bold text-slate-900 leading-tight">
            Технический паспорт МКД
          </h3>
          <p className="text-[11px] text-slate-400">
            Данные из ГИС ЖКХ и реестра Росреестра
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Основные параметры
        </span>
        <div className="grid grid-cols-2 gap-2">
          {generalItems.map((item, index) => (
            <div
              key={index}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {item.label}
                </span>
                {item.badge}
              </div>
              <span className="text-[13px] font-bold text-slate-800 mt-0.5 truncate">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Площадь здания
        </span>
        <div className="grid grid-cols-2 gap-2">
          {areaItems.map((item, index) => (
            <div
              key={index}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col"
            >
              <span className="text-[11px] text-slate-400 font-medium">
                {item.label}
              </span>
              <span className="text-[13px] font-bold text-slate-800 mt-0.5 truncate">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Управление и совет дома
        </span>
        <div className="flex flex-col gap-2">
          {managementItems.map((item, index) => (
            <div
              key={index}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
            >
              <span className="text-[12px] text-slate-500 font-medium">
                {item.label}
              </span>
              <span className="text-[13px] font-bold text-slate-800 text-right truncate max-w-[60%]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Государственные реестры
        </span>
        <div className="flex flex-col gap-2">
          {registryItems.map((item, index) => (
            <div
              key={index}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
            >
              <span className="text-[12px] text-slate-500 font-medium">
                {item.label}
              </span>
              <span className="text-[12px] font-mono font-semibold text-slate-700 truncate max-w-[60%]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

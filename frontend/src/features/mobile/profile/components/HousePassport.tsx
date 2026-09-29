import React from 'react';
import { HouseDetailResponse } from '../../../../shared/types/house';

interface HousePassportProps {
  house: HouseDetailResponse;
}

export const HousePassport: React.FC<HousePassportProps> = ({ house }) => {
  const items = [
    { label: 'Год постройки', value: house.year_built ? `${house.year_built} г.` : '—' },
    { label: 'Этажность', value: house.floors ? `${house.floors} эт.` : '—' },
    { label: 'Подъездов', value: house.entrances || '—' },
    { label: 'Квартир', value: house.apartments_count || '—' },
    { label: 'Общая площадь', value: house.total_area ? `${house.total_area} м²` : '—' },
    { label: 'Жилая площадь', value: house.living_area ? `${house.living_area} м²` : '—' },
    { label: 'Материал стен', value: house.wall_material || 'Кирпич' },
    { label: 'Серия дома', value: house.project_series || 'Индивидуальный' },
    { label: 'Кадастровый номер', value: house.cadastral_number || '—' },
    { label: 'Управление', value: house.uk_name || 'УК' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[19px]">home_work</span>
        </div>
        <h3 className="text-[15px] font-bold text-slate-900">
          Технический паспорт дома
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {items.map((item, index) => (
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
  );
};

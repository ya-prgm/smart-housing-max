import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ukApi } from '../../api';

export const HouseDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: house, isLoading } = useQuery({
    queryKey: ['uk-house-details', id],
    queryFn: () => ukApi.getHouseDetails(id || 1),
  });

  if (isLoading || !house) {
    return <div className="p-8 text-center text-slate-400">Загрузка паспорта дома...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/uk/houses')}
          className="h-9 px-3 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
        >
          ← К списку домов
        </button>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {house.address}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-xs text-slate-400 font-medium">Квартирография</span>
          <span className="text-2xl font-bold text-slate-900 mt-1">{house.apartments_count} квартир</span>
          <span className="text-xs text-slate-500 mt-1">{house.entrances} подъезда • {house.floors} этажей</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-xs text-slate-400 font-medium">Площадь строения</span>
          <span className="text-2xl font-bold text-slate-900 mt-1">{house.total_area} м²</span>
          <span className="text-xs text-slate-500 mt-1">Жилая: {house.living_area} м²</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-xs text-slate-400 font-medium">Год постройки и серия</span>
          <span className="text-2xl font-bold text-slate-900 mt-1">{house.year_built} г.</span>
          <span className="text-xs text-slate-500 mt-1">{house.project_series || 'Индивидуальный проект'}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
        <h3 className="font-bold text-slate-900 text-base">Технические характеристики и реестры</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Кадастровый номер</span>
            <span className="font-mono font-medium text-slate-800 mt-0.5">{house.cadastral_number || '—'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">ФИАС код</span>
            <span className="font-mono font-medium text-slate-800 mt-0.5">{house.fias_code || '—'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Материал стен</span>
            <span className="font-medium text-slate-800 mt-0.5">{house.wall_material || 'Кирпич'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Председатель Совета МКД</span>
            <span className="font-medium text-slate-800 mt-0.5">{house.chairman_name || 'Смирнова Е. В.'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Диспетчерский пункт</span>
            <span className="font-medium text-slate-800 mt-0.5">{house.dispatcher_phone || '+7 (843) 236-41-12'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Аварийная служба</span>
            <span className="font-medium text-slate-800 mt-0.5">{house.emergency_phone || '+7 (843) 236-00-00'}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
        <h3 className="font-bold text-slate-900 text-base">Обслуживающие организации и поставщики ресурсов</h3>
        <div className="flex flex-col divide-y divide-slate-100">
          {(house.providers || []).map((p: any) => (
            <div key={p.id} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 text-sm">{p.name}</span>
                <p className="text-xs text-slate-400">{p.service_description}</p>
              </div>
              {p.phone && <span className="font-mono text-xs font-semibold text-primary">{p.phone}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

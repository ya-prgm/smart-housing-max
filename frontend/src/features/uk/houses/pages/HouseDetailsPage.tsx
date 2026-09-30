import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ukApi } from '../../api';
import { formatPhone } from '../../../../shared/lib/formatPhone';

export const HouseDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const storedHouseId = Number(localStorage.getItem('selected_house_id')) || 1;
  const [selectedHouseId, setSelectedHouseId] = useState<number>(id ? Number(id) : storedHouseId);

  const { data: houses = [] } = useQuery({
    queryKey: ['uk-houses'],
    queryFn: ukApi.getHouses,
  });

  const { data: house, isLoading } = useQuery({
    queryKey: ['uk-house-details', selectedHouseId],
    queryFn: () => ukApi.getHouseDetails(selectedHouseId),
  });

  const getWearBadge = (wear?: number | null) => {
    if (wear == null) return null;
    if (wear <= 20) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          Отличное ({wear}%)
        </span>
      );
    }
    if (wear <= 40) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
          Хорошее ({wear}%)
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
        Удовлетворительное ({wear}%)
      </span>
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'water':
        return (
          <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'heating':
        return (
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
          </svg>
        );
      case 'electricity':
        return (
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'elevator':
        return (
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
    }
  };

  if (isLoading || !house) {
    return <div className="p-12 text-center text-slate-400">Загрузка паспорта дома...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              МКД в управлении
            </span>
            <span className="text-xs text-slate-400 font-medium">ГИС ЖКХ / Росреестр</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {house.address}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {house.city}, {house.district}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {houses.length > 1 && (
            <select
              value={selectedHouseId}
              onChange={(e) => {
                const nextId = Number(e.target.value);
                setSelectedHouseId(nextId);
                localStorage.setItem('selected_house_id', String(nextId));
              }}
              className="h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {houses.map((h) => (
                <option key={h.id} value={h.id}>{h.address}</option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={() => navigate('/uk/houses')}
            className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
          >
            ← К списку домов
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Квартирография</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">{house.apartments_count}</span>
            <span className="text-xs text-slate-500 font-medium ml-1.5">квартир</span>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              {house.entrances} подъезда • {house.floors} этажей
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Площадь строения</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {Number(house.total_area || 0).toLocaleString('ru-RU')}
            </span>
            <span className="text-xs text-slate-500 font-medium ml-1.5">м²</span>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              Жилая площадь: {Number(house.living_area || 0).toLocaleString('ru-RU')} м²
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Год постройки</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-slate-900 tracking-tight">{house.year_built}</span>
              <span className="text-xs text-slate-500 font-medium">год</span>
              {getWearBadge(house.wear_percentage)}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium truncate">
              {house.project_series || 'Индивидуальный проект'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 text-base">Технический паспорт МКД</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-medium">Кадастровый номер</span>
              <span className="font-mono font-bold text-slate-800 mt-0.5 block truncate">
                {house.cadastral_number || '16:50:010203:412'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-medium">Код ФИАС</span>
              <span className="font-mono font-bold text-slate-800 mt-0.5 block truncate">
                {house.fias_code || 'd8a83d02-1d54-4a24-9b21-4f18392a83f1'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-medium">Код ОКТМО</span>
              <span className="font-mono font-bold text-slate-800 mt-0.5 block truncate">
                {house.oktmo || '92701000'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-medium">Материал стен</span>
              <span className="font-bold text-slate-800 mt-0.5 block truncate">
                {house.wall_material || 'Кирпич / Монолит'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
              <span className="text-slate-400 block font-medium">Способ управления</span>
              <span className="font-bold text-slate-800 mt-0.5 block">
                {house.management_type || 'Управление управляющей организацией'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
              <span className="text-slate-400 block font-medium">Председатель Совета МКД</span>
              <span className="font-bold text-slate-800 mt-0.5 block">
                {house.chairman_name || 'Смирнова Елена Васильевна'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 text-base">Аварийные контакты дома</h3>
          </div>

          <div className="flex flex-col gap-3">
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Аварийно-диспетчерская служба (24/7)</span>
                <span className="text-[11px] text-rose-600 font-medium">Круглосуточный выезд бригады</span>
              </div>
              <a
                href={`tel:${house.emergency_phone || '+7 (843) 236-00-00'}`}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold shadow-xs transition"
              >
                {formatPhone(house.emergency_phone || '+7 (843) 236-00-00')}
              </a>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Диспетчер по заявкам жителей</span>
                <span className="text-[11px] text-blue-600 font-medium">Прием заявок и консультации</span>
              </div>
              <a
                href={`tel:${house.dispatcher_phone || '+7 (843) 236-41-12'}`}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold shadow-xs transition"
              >
                {formatPhone(house.dispatcher_phone || '+7 (843) 236-41-12')}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Поставщики коммунальных ресурсов (РСО)</h3>
            <p className="text-xs text-slate-400 mt-0.5">Организации, с которыми заключены прямые договоры на поставку ресурсов</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
            {house.providers?.length || 0} поставщиков
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(house.providers || []).map((p: any) => (
            <div
              key={p.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                  {getCategoryIcon(p.category)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900 truncate">{p.name}</span>
                    {p.brand_badge && (
                      <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">
                        {p.brand_badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{p.service_description}</p>
                </div>
              </div>

              {p.phone && (
                <a
                  href={`tel:${p.phone}`}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-blue-600 text-xs font-semibold hover:bg-blue-50 transition"
                >
                  {formatPhone(p.phone)}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

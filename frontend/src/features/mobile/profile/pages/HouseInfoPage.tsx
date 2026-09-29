import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyHouse } from '../hooks/useProfile';
import { HousePassport } from '../components/HousePassport';
import { RsoList } from '../components/RsoList';
import { Skeleton } from '../../../../shared/ui/Skeleton';
import { ErrorState } from '../../../../shared/ui/ErrorState';

export const HouseInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { house, isLoading, isError, refetch } = useMyHouse();

  return (
    <div className="bg-[#f7f9ff] font-sans text-slate-900 flex flex-col min-h-screen relative select-none pb-24">
      <header className="fixed top-0 w-full z-40 pt-safe bg-white/90 backdrop-blur-xl shadow-xs border-b border-slate-200/70">
        <div className="h-14 px-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Назад"
              onClick={() => navigate(-1)}
              className="w-11 h-11 flex items-center justify-center rounded-full text-slate-800 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-[18px] font-semibold text-slate-900">О доме</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full pt-16 px-4 max-w-md mx-auto">
        <div className="flex flex-col w-full space-y-4 pt-3">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-44 w-full rounded-3xl" />
              <Skeleton className="h-64 w-full rounded-3xl" />
            </div>
          ) : isError || !house ? (
            <ErrorState
              title="Не удалось загрузить данные о доме"
              onRetry={() => refetch()}
            />
          ) : (
            <>
              <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200/80 p-5 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Многоквартирный дом
                  </p>
                  <h2 className="text-[22px] font-bold text-slate-900 leading-tight">
                    {house.address}
                  </h2>
                </div>

                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[20px] text-slate-400 mt-0.5 shrink-0">
                    pin_drop
                  </span>
                  <p className="text-[14px] text-slate-600 leading-snug">
                    {house.postal_code ? `${house.postal_code}, ` : ''}
                    {house.city}, {house.district}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {house.floors && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[12px] font-medium">
                      <span className="material-symbols-outlined text-[15px]">stairs</span>
                      <span>{house.floors} этажей</span>
                    </div>
                  )}
                  {house.entrances && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[12px] font-medium">
                      <span className="material-symbols-outlined text-[15px]">door_front</span>
                      <span>{house.entrances} подъезда</span>
                    </div>
                  )}
                  {house.apartments_count && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-primary text-[12px] font-medium">
                      <span className="material-symbols-outlined text-[15px]">apartment</span>
                      <span>{house.apartments_count} квартир</span>
                    </div>
                  )}
                </div>
              </div>

              <HousePassport house={house} />

              <RsoList
                providers={house.providers || []}
                dispatcherPhone={house.dispatcher_phone}
                emergencyPhone={house.emergency_phone}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};
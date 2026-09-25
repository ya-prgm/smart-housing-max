import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const VoteDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="bg-[#f7f9ff] text-slate-900 min-h-screen flex flex-col relative select-none pb-28">
      <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 pt-safe">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Назад"
              onClick={() => navigate('/votes')}
              className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight truncate max-w-[240px]">
              Установка шлагбаума и...
            </h1>
          </div>
        </div>
      </header>

      <div className="relative w-full h-44 overflow-hidden">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuecv9Nl2z8_7zyt825CAmghZWMlaV2f98cMknDb13yzbk8qBFKo-o136yVRbd0bmGEnyalLtnl8ViptaNhTYWPPP_BdWzzRwAAZlH-7j3AcHYFa2zHlJqa4ptAfUVg3xASftAOyjyGyxDZJWWWsXh2pf82AyTDs2GbGhUOMWwaMYqm9bA-6tJ5-6HfWMouv2JbuMI33HNKDH211RZgO-MAN3D_LCdpC08Nq2mGUCpU1_adKwgQDA"
          alt="Обложка опроса"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f7f9ff] via-[#f7f9ff]/30 to-transparent" />
      </div>

      <main className="px-4 -mt-6 flex flex-col gap-4 relative z-10 max-w-[430px] mx-auto w-full">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-slate-900 leading-tight">Елена Смирнова</span>
                <span className="text-[12px] text-slate-500">Председатель ТСЖ</span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-semibold">
              Активен
            </span>
          </div>

          <div>
            <h2 className="text-[17px] font-bold text-slate-900 leading-snug">
              Установка шлагбаума и системы видеонаблюдения во дворе
            </h2>
            <p className="text-[13px] text-slate-600 leading-relaxed mt-1.5">
              Уважаемые собственники и жильцы! Для повышения безопасности нашего двора, ограничения несанкционированного въезда постороннего транспорта и сохранности детской площадки предлагается утвердить установку автоматического шлагбаума с GSM-модулем и распознаванием номеров, а также монтаж 6 камер видеонаблюдения высокого разрешения с доступом к архиву через приложение.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-slate-900">Ход голосования (кворум)</span>
            <span className="text-[13px] font-bold text-primary">68%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden relative">
            <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: '68%' }} />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
              <span className="text-[11px] text-slate-400">Время</span>
              <span className="text-[13px] font-bold text-slate-900 mt-0.5">~3 мин</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
              <span className="text-[11px] text-slate-400">Вопросы</span>
              <span className="text-[13px] font-bold text-slate-900 mt-0.5">4 пункта</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
              <span className="text-[11px] text-slate-400">Дедлайн</span>
              <span className="text-[13px] font-bold text-slate-900 mt-0.5">До 25 мая</span>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/70 p-4 pb-safe">
        <button
          type="button"
          onClick={() => navigate(`/votes/${id || '1'}/step`)}
          className="w-full h-12 rounded-full text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all bg-primary hover:bg-primary/90 cursor-pointer"
        >
          <span>Приступить к опросу</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
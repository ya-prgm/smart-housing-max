import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Poll } from '../../../../shared/types/vote';

const INITIAL_POLLS: Poll[] = [
  {
    id: '1',
    title: 'Установка шлагбаума и системы видеонаблюдения во дворе',
    description: 'Принятие решения об установке шлагбаума на въезде и дополнительных камер на детской площадке.',
    authorName: 'Председатель ТСЖ',
    authorRole: 'Елена Смирнова',
    status: 'pending',
    deadline: '2 дня',
    estimatedTime: '~3 мин',
    questionsCount: 4,
    participantsCount: 184,
  },
  {
    id: '2',
    title: 'Выбор цветовой гаммы для ремонта входных групп (подъездов)',
    description: 'Дизайнеры подготовили 3 варианта отделки первого этажа и лифтовых холлов. Выберите лучший.',
    authorName: 'УК «ЖилКомФорт»',
    authorRole: 'Управляющая организация',
    status: 'pending',
    deadline: 'До 28 апр',
    estimatedTime: '~2 мин',
    questionsCount: 3,
    participantsCount: 92,
  },
  {
    id: '3',
    title: 'Оценка качества весенней уборки придомовой территории',
    description: 'Спасибо за участие! Ваш голос учтен и отправлен в отдел контроля качества управляющей компании.',
    authorName: 'УК «ЖилКомФорт»',
    authorRole: 'Управляющая организация',
    status: 'completed',
    deadline: 'Завершён',
    estimatedTime: '1 мин',
    questionsCount: 2,
    participantsCount: 210,
    isCompleted: true,
  },
  {
    id: '4',
    title: 'Благоустройство зоны для выгула собак',
    description: 'Итоговое решение по обустройству специализированной огороженной площадки.',
    authorName: 'Председатель ТСЖ',
    authorRole: 'Совет дома',
    status: 'archived',
    deadline: 'Архив',
    estimatedTime: '2 мин',
    questionsCount: 3,
    participantsCount: 245,
  },
];

export const VotesPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'archived'>('all');
  const [search, setSearch] = useState('');

  const filteredPolls = INITIAL_POLLS.filter((poll) => {
    if (filter !== 'all' && poll.status !== filter) return false;
    if (search.trim()) {
      return (
        poll.title.toLowerCase().includes(search.toLowerCase()) ||
        poll.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full relative min-h-screen pb-24">
      <header className="sticky top-0 w-full z-30 pt-safe bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-xs">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[20px]">how_to_vote</span>
            </div>
            <span className="text-[17px] font-bold text-slate-900 tracking-tight">МОЙ ДОМ</span>
          </div>
          <div className="relative">
            <button
              type="button"
              aria-label="Уведомления"
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-600"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </div>
        </div>
      </header>

      <div className="px-4 pt-3 flex flex-col gap-3">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по опросам..."
            className="w-full h-11 pl-11 pr-3 bg-white text-slate-900 text-[14px] rounded-xl border border-slate-200/80 shadow-xs placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: 'Все (4)' },
            { id: 'pending', label: 'Требуют ответа (2)' },
            { id: 'completed', label: 'Пройденные (1)' },
            { id: 'archived', label: 'Архив (1)' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id as typeof filter)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all active:scale-95 ${
                filter === item.id
                  ? 'bg-primary text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between mb-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[22px]">how_to_vote</span>
              </div>
              <div>
                <div className="text-[16px] font-bold text-slate-900 leading-tight">Ваш голос важен</div>
                <p className="text-[12px] text-slate-500">Пройдено 1 из 3 актуальных опросов</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold">
              33%
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex gap-0.5 p-0.5">
            <div className="bg-primary h-full w-1/3 rounded-full"></div>
            <div className="bg-transparent h-full w-1/3 rounded-full"></div>
            <div className="bg-transparent h-full w-1/3 rounded-full"></div>
          </div>
        </div>
      </div>

      <main className="px-4 pt-3 flex flex-col gap-3.5">
        {filteredPolls.map((poll) => (
          <article
            key={poll.id}
            onClick={() => navigate(`/votes/${poll.id}`)}
            className="bg-white p-4 sm:p-5 rounded-[22px] border border-slate-100 shadow-card flex flex-col gap-3 transition-all cursor-pointer active:scale-[0.99] hover:border-slate-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-primary text-[14px]">
                  <span className="material-symbols-outlined text-[15px]">
                    {poll.authorName.includes('УК') ? 'corporate_fare' : 'shield_person'}
                  </span>
                </div>
                <span className="text-[13px] text-slate-900 font-semibold">{poll.authorName}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {poll.status === 'pending' && (
                  <>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[11px] font-medium border border-rose-100">
                      Не пройден
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px]">alarm</span>
                      {poll.deadline}
                    </span>
                  </>
                )}
                {poll.status === 'completed' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    Пройдено вами
                  </span>
                )}
                {poll.status === 'archived' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-medium">
                    Завершён
                  </span>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-[15px] font-bold text-slate-900 leading-snug">{poll.title}</h2>
              <p className="text-[13px] text-slate-600 mt-1 leading-relaxed">{poll.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-medium text-slate-600">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                {poll.estimatedTime}
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-medium text-slate-600">
                <span className="material-symbols-outlined text-[14px]">quiz</span>
                {poll.questionsCount} вопроса
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-100 text-[11px] font-medium text-sky-800">
                <span className="material-symbols-outlined text-[14px]">group</span>
                {poll.participantsCount} жильцов
              </span>
            </div>

            {poll.status === 'pending' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/votes/${poll.id}`);
                }}
                className="w-full h-11 bg-primary text-white rounded-full font-semibold text-[14px] flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all hover:bg-primary/90 mt-1"
              >
                <span>Пройти опрос</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            )}
          </article>
        ))}
      </main>
    </div>
  );
};
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeHouse, setActiveHouse] = useState('ул. Баумана, 12');
  const [newPostText, setNewPostText] = useState('');
  const [posts, setPosts] = useState([
    {
      id: '1',
      authorName: 'Елена Смирнова',
      authorBadge: 'Председатель',
      avatarText: 'ЕС',
      time: 'Сегодня в 10:45 • Баумана, 12',
      title: 'Уважаемые соседи! Итоги планового обхода инженерных сетей и подвальных помещений.',
      paragraphs: [
        'Сегодня совместно с главным инженером УК «Уют-Сервис» провели осмотр теплового пункта и насосного оборудования перед началом гидравлических испытаний. Все системы работают штатно, утечек не зафиксировано.',
        'На следующей неделе запланирована замена вводной задвижки во 2-м подъезде. Отключение воды будет кратковременным — не более 2 часов. Точный график опубликуем в понедельник.',
      ],
      likes: 42,
      dislikes: 2,
      comments: 15,
      views: 324,
    },
    {
      id: '2',
      authorName: 'УК «Уют-Сервис» (Диспетчер)',
      avatarText: 'УК',
      time: 'Вчера в 16:20 • Закреплено',
      title: 'Плановая дезинфекция и промывка мусоростволов 24–25 октября',
      paragraphs: [
        'Уведомляем жителей подъездов №1, №2 и №3: в четверг и пятницу специализированная служба будет производить санитарную обработку стволов мусоропроводов. Просим плотно закрывать загрузочные клапаны на лестничных клетках и не оставлять пакеты с отходами на площадках.',
      ],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDTW5CiR-c4r0W5UpPD2rLI6ldHp94SwSDHotC1FvT1MGUDWNhNwFf4VI8myyH-T0uNqoe5XSknET06ZG4yXvSGY8CMxgFRri_G3YjBtL36puzb41mwrZeh9nfDNZDyqh-rjoR-3bDTCjqkYnG4AyLZggO6ynSMIxg7zNaolINRthbjnHyDgoasnUlakWlxqeuvfayLSw2n_077ptanUHcKL6tXGtb4RWTEAVoC38VgR2-TNgoKWXRu3DSriHqOHxfE',
      scheduleTitle: 'График работ',
      scheduleRows: ['24 октября: Подъезд 1-2', '25 октября: Подъезд 3-4'],
      likes: 58,
      dislikes: 0,
      comments: 6,
      views: 418,
    },
  ]);

  const handlePublishPost = () => {
    if (!newPostText.trim()) return;
    const newPost = {
      id: `p_${Date.now()}`,
      authorName: 'ООО УК «ЖилКомФорт»',
      avatarText: 'УК',
      time: 'Только что • Баумана, 12',
      title: 'Официальное сообщение управляющей организации',
      paragraphs: [newPostText],
      likes: 0,
      dislikes: 0,
      comments: 0,
      views: 1,
    };
    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  return (
    <div className="bg-slate-100 text-slate-800 antialiased font-sans flex min-h-screen">
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 shrink-0 z-30 select-none">
        <div>
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <img
              alt="Логотип Мой Дом MAX"
              className="w-10 h-10 object-contain rounded-xl shadow-xs border border-slate-100"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaMcdCORlGJjRcPSHW1wMrtVVDQaTFsLC5c5WvtikXxrqyufHBRPp3VNHsnTojy-lZSc64zFGXA-_yPI9c5p36wl-JPpFS6bu_2q_gb0H59zzxK2W-QrXUqBWEIynHi4lAoho86-rOYiN6LS8PrjxOlxH7g-8P3FayTdluJu3iE5gwoO2Fp8RSgq0G9wJ1uCPwZr3up5jqO1J9KnWrYmpFX-kjGYneqzadEfJPVGmNavIGxEEMo4Fr_dQi0ng9n6z1"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[17px] tracking-tight text-slate-900 leading-tight">
                  МОЙ ДОМ
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium block">
                Кабинет управления МКД
              </span>
            </div>
          </div>

          <div className="p-4 mx-3 my-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0 border border-blue-500 ring-2 ring-blue-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div className="overflow-hidden flex-1">
              <div className="font-bold text-sm text-slate-900 truncate">ООО УК «ЖилКомФорт»</div>
              <div className="text-[11px] font-medium text-blue-700 truncate">
                Управляющая Организация
              </div>
            </div>
          </div>

          <nav className="px-3 space-y-1">
            <button
              type="button"
              onClick={() => navigate('/uk/dashboard')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-blue-50 text-blue-700 font-semibold text-sm border border-blue-100 shadow-xs transition"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>Главная (Лента дома)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/tickets')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium text-sm transition"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span>Обращения жителей</span>
              </div>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-xs">
                3
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/votes')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium text-sm transition"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span>Опросы и голосования</span>
              </div>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                1
              </span>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium text-sm transition"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span>Реестр квартир и Л/С</span>
              </div>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium text-sm transition"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span>Документы и отчеты</span>
              </div>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium text-sm transition"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                <span>Диспетчерский журнал</span>
              </div>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium text-sm transition"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span>Настройки</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/uk/houses')}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Выйти в выбор домов</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Поиск по публикациям, жильцам и заявкам..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs text-slate-800 placeholder-slate-400 border border-transparent focus:border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-100 transition outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePublishPost}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:shadow transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>Новая публикация</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-[1400px] w-full mx-auto grid grid-cols-12 gap-8 items-start">
          <section className="col-span-12 xl:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3.5">
              <div className="flex items-center justify-between mb-2.5 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Объекты в управлении
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/uk/houses')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Все объекты в каталоге</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {[
                  'ул. Баумана, 12',
                  'ул. Флотская, 30',
                  'ул. Чистопольская, 65',
                  'пр-т Победы, 139',
                  'ул. Декабристов, 85',
                  'ул. Пушкина, 42',
                ].map((house) => (
                  <button
                    key={house}
                    type="button"
                    onClick={() => setActiveHouse(house)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition shrink-0 cursor-pointer ${
                      activeHouse === house
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{house}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-bold text-xs text-slate-900">ООО УК «ЖилКомФорт»</span>
                  </div>
                  <textarea
                    rows={2}
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder={`Опубликовать официальное объявление от лица Управляющей Компании для жильцов дома ${activeHouse}...`}
                    className="w-full text-sm text-slate-800 placeholder-slate-400 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition p-3 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    <span>Фото</span>
                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    <span>Документ</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handlePublishPost}
                  className="bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Опубликовать
                </button>
              </div>
            </div>

            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
              >
                <div className="p-5 pb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-full font-bold text-sm flex items-center justify-center shrink-0 ${
                        post.avatarText === 'УК'
                          ? 'bg-emerald-600 text-white text-xs'
                          : 'bg-gradient-to-tr from-blue-700 to-sky-500 text-white'
                      }`}
                    >
                      {post.avatarText}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{post.authorName}</span>
                        {post.authorBadge && (
                          <span className="bg-blue-100 text-blue-700 font-semibold text-[10px] px-2 py-0.5 rounded-md">
                            {post.authorBadge}
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-slate-400 mt-0.5">{post.time}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>

                <div className="px-5 py-2 text-sm text-slate-700 leading-relaxed space-y-2">
                  <p className="font-medium text-slate-900 text-base">{post.title}</p>
                  {post.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {post.image && (
                  <div className="px-5 pt-2 pb-4">
                    <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden border border-slate-200">
                      <div className="h-44 bg-slate-100 relative group overflow-hidden flex items-center justify-center">
                        <img
                          alt="Фотоотчет"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                          src={post.image}
                        />
                        <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded">
                          Фотоотчет работ
                        </span>
                      </div>
                      <div className="h-44 bg-slate-800 text-white p-4 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400">
                            {post.scheduleTitle}
                          </span>
                          {post.scheduleRows?.map((row, rIdx) => (
                            <div key={rIdx} className="font-bold text-sm mt-1">
                              {row}
                            </div>
                          ))}
                        </div>
                        <div className="text-[11px] text-slate-300">
                          По всем вопросам: <span className="text-white font-semibold">+7 (495) 890-12-34</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-blue-50 hover:text-blue-600 transition font-medium text-slate-700"
                    >
                      <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                      <span className="font-semibold text-blue-700 ml-0.5">{post.likes}</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-rose-50 hover:text-rose-600 transition font-medium text-slate-700"
                    >
                      <span className="material-symbols-outlined text-[18px]">thumb_down</span>
                      <span className="font-semibold text-slate-600 ml-0.5">{post.dislikes}</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-blue-50 hover:text-blue-600 transition font-medium text-slate-700"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                      <span>Комментарии</span>
                      <span className="font-semibold text-slate-600 ml-0.5">{post.comments}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    <span className="text-xs font-medium">{post.views}</span>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="col-span-12 xl:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-900">Паспорт дома</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  В управлении
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">{activeHouse}</h3>
                  <p className="text-xs text-slate-400">Казань, Вахитовский район</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">Всего квартир</div>
                  <div className="text-base font-extrabold text-slate-800 mt-0.5">120</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">В системе</div>
                  <div className="text-base font-extrabold text-blue-600 mt-0.5">103</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-bold text-sm text-slate-900">Новые обращения</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/tickets')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Все (14) →
                </button>
              </div>
              <div className="mt-3 space-y-3">
                <div
                  onClick={() => navigate('/tickets')}
                  className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 hover:bg-rose-50 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-rose-500 font-medium">25 мин назад</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-1">
                    Протечка стояка отопления на 4 этаже
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>Заявитель: Артем К.</span>
                  </div>
                </div>

                <div
                  onClick={() => navigate('/tickets')}
                  className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 hover:bg-amber-50 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium">2 часа назад</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-1">
                    Шум и скрежет при движении грузового лифта
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>Заявитель: Ольга В.</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/tickets')}
                className="w-full mt-3 py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Перейти в Обращения жителей
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4">
              <div className="text-xs font-bold text-slate-900 mb-2">Экстренные контакты дома</div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Круглосуточная диспетчерская</span>
                  <a className="font-semibold text-blue-600 hover:underline" href="tel:88002001234">
                    +7 (800) 200-12-34
                  </a>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Аварийная служба лифтов</span>
                  <a className="font-semibold text-blue-600 hover:underline" href="tel:88432100000">
                    +7 (843) 210-00-00
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};
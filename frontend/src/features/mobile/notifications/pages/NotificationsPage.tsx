import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHaptic } from '../../../../shared/hooks/useHaptic';
import { NotificationCategory, NotificationItem } from '../../../../shared/types/notification';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    category: 'uk',
    authorName: 'УК «ЖилКомФорт»',
    authorBadge: 'УК',
    time: 'Сегодня, 11:42',
    title: 'Плановое отключение ГВС',
    text: 'В связи с гидравлическими испытаниями в 3-м подъезде подача горячей воды будет приостановлена с 13:00 до 17:00.',
    isUnread: true,
    icon: 'apartment',
  },
  {
    id: '2',
    category: 'chairperson',
    authorName: 'Елена Смирнова',
    authorBadge: 'Председатель',
    time: 'Сегодня, 09:15',
    title: 'Запущен новый опрос по шлагбауму',
    text: 'Пожалуйста, проголосуйте во вкладке «Опросы». Сбор мнений продлится до 25 мая.',
    isUnread: true,
    avatarText: 'ЕС',
  },
  {
    id: '3',
    category: 'system',
    authorName: 'Система',
    time: 'Вчера, 19:30',
    title: 'Оплата счета ЖКХ успешно проведена',
    text: 'Платеж на сумму 4 820 ₽ через СБП успешно зачислен на лицевой счет 8492-3019-44. Чек доступен в профиле.',
    isUnread: true,
    icon: 'check_circle',
  },
  {
    id: '4',
    category: 'chairperson',
    authorName: 'Елена Смирнова',
    authorBadge: 'Председатель',
    time: '16 мая, 14:10',
    title: 'Итоги встречи Совета МКД',
    text: 'Протокол согласования благоустройства двора опубликован в ленте дома.',
    isUnread: false,
    avatarText: 'ЕС',
  },
  {
    id: '5',
    category: 'uk',
    authorName: 'УК «ЖилКомФорт»',
    time: '14 мая, 10:00',
    title: 'Обращение #104 закрыто',
    text: 'Замена лампы освещения на 4-м этаже выполнена.',
    isUnread: false,
    icon: 'build',
  },
  {
    id: '6',
    category: 'system',
    authorName: 'Система',
    time: '10 мая, 08:00',
    title: 'Сформирован ЕПД за апрель 2025',
    text: 'Квитанция начислений за ЖКУ готова к просмотру и оплате.',
    isUnread: false,
    icon: 'receipt_long',
  },
];

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { impact, notification } = useHaptic();

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('all');

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const handleMarkAllRead = () => {
    impact('medium');
    notification('success');
    setNotifications((prev) => prev.map((item) => ({ ...item, isUnread: false })));
  };

  const handleItemClick = (id: string) => {
    impact('light');
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isUnread: false } : item))
    );
  };

  const filteredNotifications = notifications.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const newItems = filteredNotifications.filter((n) => n.isUnread);
  const earlierItems = filteredNotifications.filter((n) => !n.isUnread);

  return (
    <div className="bg-[#f7f9ff] text-slate-900 min-h-screen flex flex-col relative select-none pb-12">
      <header className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-xl shadow-xs border-b border-slate-200/70 pt-safe">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Назад"
              onClick={() => navigate(-1)}
              className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-primary active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
            </button>
            <h1 className="text-[18px] font-semibold text-slate-900">Уведомления</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full pt-16 px-4 max-w-md mx-auto">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <span className="text-[18px] font-bold text-slate-900">Входящие</span>
            <span
              className={`inline-flex items-center justify-center px-2 h-5 rounded-full text-[11px] font-semibold ${
                unreadCount > 0
                  ? 'bg-secondary text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {unreadCount} новых
            </span>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 text-primary hover:text-secondary active:scale-95 transition-transform text-[13px] font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">done_all</span>
              <span>Прочитать все</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar -mx-4 px-4">
          <button
            type="button"
            onClick={() => {
              impact('light');
              setSelectedCategory('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap active:scale-95 transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Все</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {notifications.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              impact('light');
              setSelectedCategory('system');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap active:scale-95 transition-all ${
              selectedCategory === 'system'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">notifications</span>
            <span>Система</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedCategory === 'system' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {notifications.filter((n) => n.category === 'system').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              impact('light');
              setSelectedCategory('chairperson');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap active:scale-95 transition-all ${
              selectedCategory === 'chairperson'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-sky-200 flex items-center justify-center text-[9px] font-bold text-sky-900">
              ЕС
            </span>
            <span>Председатель</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedCategory === 'chairperson'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {notifications.filter((n) => n.category === 'chairperson').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              impact('light');
              setSelectedCategory('uk');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap active:scale-95 transition-all ${
              selectedCategory === 'uk'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">domain</span>
            <span>УК «ЖилКомФорт»</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedCategory === 'uk' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {notifications.filter((n) => n.category === 'uk').length}
            </span>
          </button>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <span className="material-symbols-outlined text-[28px]">notifications_off</span>
            </div>
            <p className="text-[15px] font-semibold text-slate-800">Нет уведомлений</p>
            <p className="text-[13px] text-slate-400 mt-0.5">
              В выбранной категории пока нет сообщений
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-2">
            {newItems.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Новые
                  </span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>

                {newItems.map((item) => (
                  <article
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className="relative flex flex-col p-4 rounded-2xl bg-white shadow-xs border border-slate-100 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.avatarText ? (
                          <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-primary text-[11px] font-bold shrink-0">
                            {item.avatarText}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                            <span className="material-symbols-outlined text-[18px]">
                              {item.icon}
                            </span>
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-semibold text-slate-900 truncate">
                              {item.authorName}
                            </span>
                            {item.authorBadge && (
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                                {item.authorBadge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">{item.time}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        aria-label="Опции"
                        onClick={(e) => e.stopPropagation()}
                        className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>

                    <div className="mt-2 pl-10 flex flex-col gap-0.5">
                      <h2 className="text-[14px] font-semibold text-slate-900">{item.title}</h2>
                      <p className="text-[13px] text-slate-600 leading-relaxed">{item.text}</p>
                    </div>

                    <span className="absolute top-4 right-3 w-2 h-2 rounded-full bg-primary" />
                  </article>
                ))}
              </div>
            )}

            {earlierItems.length > 0 && (
              <div className="flex flex-col gap-2.5 mt-2">
                <div className="px-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Ранее
                  </span>
                </div>

                {earlierItems.map((item) => (
                  <article
                    key={item.id}
                    className="relative flex flex-col p-4 rounded-2xl bg-white/70 border border-slate-100 hover:bg-white transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.avatarText ? (
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-[11px] font-bold shrink-0">
                            {item.avatarText}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                            <span className="material-symbols-outlined text-[18px]">
                              {item.icon}
                            </span>
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-medium text-slate-800 truncate">
                              {item.authorName}
                            </span>
                            {item.authorBadge && (
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[10px]">
                                {item.authorBadge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">{item.time}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        aria-label="Опции"
                        className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>

                    <div className="mt-2 pl-10 flex flex-col gap-0.5">
                      <h2 className="text-[13px] font-semibold text-slate-800">{item.title}</h2>
                      <p className="text-[12px] text-slate-500 leading-relaxed">{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
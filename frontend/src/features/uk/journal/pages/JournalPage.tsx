import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ukApi } from '../../api';
import { formatDate } from '../../../../shared/lib/formatDate';

export const JournalPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['uk-journal'],
    queryFn: () => ukApi.getJournal(),
  });

  const logs = data?.items ?? [];

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'status_change':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">Смена статуса заявки</span>;
      case 'role_change':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">Смена роли жителя</span>;
      case 'create':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">Создание объекта</span>;
      case 'update':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">Обновление</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{action}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Диспетчерский журнал аудита
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Неизменяемая хронология юридически значимых событий, смены статусов и действий сотрудников
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Действие</th>
                <th className="py-3 px-4">Тип сущности</th>
                <th className="py-3 px-4">Исполнитель</th>
                <th className="py-3 px-4">Дом</th>
                <th className="py-3 px-4">Детали события</th>
                <th className="py-3 px-4 text-right">Время</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Загрузка записей журнала...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Журнал аудита пуст
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400">#{log.id}</td>
                    <td className="py-3.5 px-4">{getActionBadge(log.action)}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600 uppercase">{log.entity_type}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{log.user_name || 'Система'}</td>
                    <td className="py-3.5 px-4 text-slate-600">{log.house_address || 'ул. Баумана, 12'}</td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-500 max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500 text-[13px]">
                      {formatDate(log.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

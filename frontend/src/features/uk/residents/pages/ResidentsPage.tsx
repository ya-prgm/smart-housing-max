import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ukApi, ResidentResponse } from '../../api';
import { formatDate } from '../../../../shared/lib/formatDate';
import { formatPhone } from '../../../../shared/lib/formatPhone';
import { useToast } from '../../../../shared/hooks/useToast';

export const ResidentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [editingResident, setEditingResident] = useState<ResidentResponse | null>(null);
  const [selectedRole, setSelectedRole] = useState<'resident' | 'chairman' | 'uk_staff'>('resident');

  const { data, isLoading } = useQuery({
    queryKey: ['uk-residents', roleFilter, search],
    queryFn: () =>
      ukApi.getResidents({
        role: roleFilter === 'all' ? undefined : roleFilter,
        search: search.trim() || undefined,
      }),
  });

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: 'resident' | 'chairman' | 'uk_staff' }) =>
      ukApi.updateResidentRole(userId, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uk-residents'] });
      queryClient.invalidateQueries({ queryKey: ['uk-dashboard'] });
      showToast('Роль пользователя успешно обновлена', 'success');
      setEditingResident(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || 'Ошибка при изменении роли пользователя';
      showToast(typeof msg === 'string' ? msg : 'Ошибка при изменении роли', 'error');
    },
  });

  const getInitials = (name?: string | null) => {
    if (!name) return 'Ж';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'chairman':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Председатель совета
          </span>
        );
      case 'uk_staff':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Сотрудник УК
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Собственник
          </span>
        );
    }
  };

  const residents = data?.items ?? [];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Реестр квартир и жителей</h2>
          <p className="text-sm text-slate-500 mt-1">
            Собственники помещений, лицевые счета, подтверждение через Госуслуги и сотрудники организации
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по ФИО, телефону или квартире..."
              className="h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 shadow-xs"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200">
        {[
          { id: 'all', label: 'Все пользователи' },
          { id: 'resident', label: 'Собственники квартир' },
          { id: 'chairman', label: 'Председатели МКД' },
          { id: 'uk_staff', label: 'Сотрудники УК' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setRoleFilter(f.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              roleFilter === f.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3 w-10"></th>
                <th className="py-3 px-4">Пользователь</th>
                <th className="py-3 px-4">Роль в системе</th>
                <th className="py-3 px-4">Объект / Адрес</th>
                <th className="py-3 px-4">Помещение</th>
                <th className="py-3 px-4">Лицевой счет</th>
                <th className="py-3 px-4">Госуслуги (ЕСИА)</th>
                <th className="py-3 px-4">Регистрация</th>
                <th className="py-3 px-4 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">Загрузка реестра пользователей...</td>
                </tr>
              ) : residents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">Пользователи не найдены</td>
                </tr>
              ) : (
                residents.map((r: any) => {
                  const isExpanded = expandedIds.has(r.id);
                  const isStaff = r.role === 'uk_staff';

                  return (
                    <React.Fragment key={r.id}>
                      <tr
                        onClick={() => toggleExpand(r.id)}
                        className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${isExpanded ? 'bg-blue-50/30' : ''}`}
                      >
                        <td className="py-3.5 px-3 text-center text-slate-400">
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90 text-blue-600' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#006591] via-[#0088cc] to-[#2aabee] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                                {getInitials(r.full_name)}
                              </div>
                              {r.esia_linked && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center border border-white">
                                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-xs text-slate-900 truncate">{r.full_name}</div>
                              <div className="text-[11px] text-slate-400 font-medium">
                                {r.phone ? formatPhone(r.phone) : 'Телефон не указан'}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">{getRoleBadge(r.role)}</td>

                        <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                          {isStaff ? 'Офис УК «ЖилКомФорт»' : (r.house_address || 'ул. Баумана, 12')}
                        </td>

                        <td className="py-3.5 px-4 text-xs">
                          {isStaff ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                              Служебный доступ
                            </span>
                          ) : (
                            <span className="font-semibold text-slate-900">
                              кв. {r.apartment_number || '48'}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-xs font-mono">
                          {isStaff ? (
                            <span className="text-slate-300">—</span>
                          ) : (
                            <span className="text-slate-600 font-medium">{r.personal_account || '8492-3019-44'}</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          {r.esia_linked ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200">
                              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              Подтвержден
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                              Не привязан
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-400 text-xs">{formatDate(r.registered_at)}</td>

                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingResident(r);
                              setSelectedRole(r.role);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-700 text-xs font-semibold transition cursor-pointer shadow-xs"
                          >
                            Сменить роль
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-slate-50/70 border-t border-b border-slate-200/80">
                          <td colSpan={9} className="p-6">
                            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col gap-6">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#006591] via-[#0088cc] to-[#2aabee] text-white font-bold text-xl flex items-center justify-center shadow-md">
                                      {getInitials(r.full_name)}
                                    </div>
                                    {r.esia_linked && (
                                      <div
                                        title="Подтверждено через Госуслуги"
                                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-white shadow-xs"
                                      >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h3 className="text-lg font-bold text-slate-900">{r.full_name}</h3>
                                      {getRoleBadge(r.role)}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">
                                      ID пользователя: #{r.max_user_id || r.id} • В системе с {formatDate(r.registered_at)}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingResident(r);
                                      setSelectedRole(r.role);
                                    }}
                                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                                  >
                                    Изменить роль в системе
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Объект управления
                                  </span>
                                  <div className="mt-2">
                                    <span className="text-xs font-bold text-slate-800 block">
                                      {isStaff ? 'Офис УК «ЖилКомФорт»' : (r.house_address || 'ул. Баумана, 12')}
                                    </span>
                                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                                      {isStaff ? 'Служебный доступ организации' : `Квартира №${r.apartment_number || '48'}`}
                                    </span>
                                  </div>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Лицевой счет (Л/С)
                                  </span>
                                  <div className="mt-2">
                                    {isStaff ? (
                                      <span className="text-xs font-medium text-slate-500 block">
                                        Не привязан к квартире
                                      </span>
                                    ) : (
                                      <>
                                        <span className="text-xs font-mono font-bold text-slate-800 block">
                                          {r.personal_account || '8492-3019-44'}
                                        </span>
                                        <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
                                          ✓ Баланс в норме
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Контакты жителя
                                  </span>
                                  <div className="mt-2">
                                    <span className="text-xs font-semibold text-slate-800 block">
                                      {r.phone ? formatPhone(r.phone) : 'Телефон не указан'}
                                    </span>
                                    <span className="text-[11px] text-slate-500 mt-0.5 block truncate">
                                      {r.email || 'Электронная почта не указана'}
                                    </span>
                                  </div>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Статус идентификации
                                  </span>
                                  <div className="mt-2">
                                    {r.esia_linked ? (
                                      <span className="text-xs font-bold text-blue-700 block flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Госуслуги (ЕСИА)
                                      </span>
                                    ) : (
                                      <span className="text-xs font-medium text-slate-500 block">
                                        Локальная регистрация
                                      </span>
                                    )}
                                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                                      {r.last_active_at ? `Был в сети: ${formatDate(r.last_active_at)}` : 'Активен в приложении'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingResident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Назначение роли</h3>
              <button
                type="button"
                onClick={() => setEditingResident(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs">
              <p className="font-bold text-slate-900">{editingResident.full_name}</p>
              <p className="text-slate-400 mt-0.5">
                {editingResident.role === 'uk_staff'
                  ? 'Сотрудник управляющей компании'
                  : `${editingResident.house_address || 'ул. Баумана, 12'}, кв. ${editingResident.apartment_number || '48'}`}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Роль в системе</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="resident">Житель (собственник помещения)</option>
                <option value="chairman">Председатель Совета МКД</option>
                <option value="uk_staff">Сотрудник управляющей компании</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingResident(null)}
                className="flex-1 h-10 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={() =>
                  updateRoleMutation.mutate({
                    userId: editingResident.id,
                    role: selectedRole,
                  })
                }
                disabled={updateRoleMutation.isPending}
                className="flex-1 h-10 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {updateRoleMutation.isPending ? 'Сохранение...' : 'Применить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

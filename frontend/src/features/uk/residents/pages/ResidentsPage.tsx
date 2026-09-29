import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ukApi, ResidentResponse } from '../../api';
import { formatDate } from '../../../../shared/lib/formatDate';
import { useToast } from '../../../../shared/hooks/useToast';

export const ResidentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
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

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: 'resident' | 'chairman' | 'uk_staff' }) =>
      ukApi.updateResidentRole(userId, {
        role,
        house_id: 1,
        apartment_id: 1,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uk-residents'] });
      queryClient.invalidateQueries({ queryKey: ['uk-dashboard'] });
      showToast('Роль жителя успешно изменена', 'success');
      setEditingResident(null);
    },
    onError: () => {
      showToast('Ошибка при изменении роли жителя', 'error');
    },
  });

  const residents = data?.items ?? [];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'chairman':
        return <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">Председатель</span>;
      case 'uk_staff':
        return <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">Сотрудник УК</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">Житель</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Реестр жителей</h2>
          <p className="text-sm text-slate-500 mt-0.5">Собственники квартир, председатели Советов МКД и сотрудники</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по ФИО жителя..."
              className="h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-primary w-64 shadow-xs"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'all', label: 'Все пользователи' },
          { id: 'resident', label: 'Жители' },
          { id: 'chairman', label: 'Председатели МКД' },
          { id: 'uk_staff', label: 'Сотрудники УК' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setRoleFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              roleFilter === f.id
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">ФИО</th>
                <th className="py-3 px-4">Роль</th>
                <th className="py-3 px-4">Дом</th>
                <th className="py-3 px-4">Квартира</th>
                <th className="py-3 px-4">Лицевой счет</th>
                <th className="py-3 px-4">Регистрация</th>
                <th className="py-3 px-4 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">Загрузка жителей...</td>
                </tr>
              ) : residents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">Жители не найдены</td>
                </tr>
              ) : (
                residents.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{r.full_name}</td>
                    <td className="py-3.5 px-4">{getRoleBadge(r.role)}</td>
                    <td className="py-3.5 px-4 text-slate-600">{r.house_address || 'ул. Баумана, 12'}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">кв. {r.apartment_number || '48'}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[13px]">{r.personal_account || '8492-3019-44'}</td>
                    <td className="py-3.5 px-4 text-slate-500 text-[13px]">{formatDate(r.registered_at)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingResident(r);
                          setSelectedRole(r.role);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-primary hover:text-white text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                      >
                        Сменить роль
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingResident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Назначение роли</h3>
              <button
                type="button"
                onClick={() => setEditingResident(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-sm">
              <p className="font-semibold text-slate-900">{editingResident.full_name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{editingResident.house_address || 'ул. Баумана, 12'}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Роль в системе</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold focus:outline-none focus:border-primary"
              >
                <option value="resident">Житель (собственник)</option>
                <option value="chairman">Председатель Совета МКД</option>
                <option value="uk_staff">Сотрудник управляющей компании</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingResident(null)}
                className="flex-1 h-10 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 cursor-pointer"
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
                className="flex-1 h-10 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 cursor-pointer disabled:opacity-50"
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

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ukApi } from '../../api';
import { formatDate } from '../../../../shared/lib/formatDate';
import { useToast } from '../../../../shared/hooks/useToast';

export const DocumentsPage: React.FC = () => {
  const { showToast } = useToast();
  const [houseFilter, setHouseFilter] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['uk-documents', houseFilter],
    queryFn: () => ukApi.getDocuments(houseFilter),
  });

  const { data: houses = [] } = useQuery({
    queryKey: ['uk-houses'],
    queryFn: ukApi.getHouses,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
  };

  const getFormatBadge = (mime: string, filename?: string) => {
    const isPdf = mime.includes('pdf') || filename?.endsWith('.pdf');
    const isDoc = mime.includes('word') || filename?.endsWith('.docx') || filename?.endsWith('.doc');
    const isXls = mime.includes('excel') || mime.includes('spreadsheet') || filename?.endsWith('.xlsx');

    if (isPdf) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          PDF
        </span>
      );
    }
    if (isDoc) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          DOCX
        </span>
      );
    }
    if (isXls) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          XLSX
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
        FILE
      </span>
    );
  };

  const filteredDocs = documents.filter((doc) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchesTitle = doc.title.toLowerCase().includes(q);
      const matchesHouse = doc.house_address.toLowerCase().includes(q);
      if (!matchesTitle && !matchesHouse) return false;
    }
    if (categoryFilter === 'passport' && !doc.title.toLowerCase().includes('паспорт')) return false;
    if (categoryFilter === 'protocol' && !doc.title.toLowerCase().includes('протокол') && !doc.title.toLowerCase().includes('решен')) return false;
    if (categoryFilter === 'act' && !doc.title.toLowerCase().includes('акт') && !doc.title.toLowerCase().includes('осмотр')) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Электронный архив документов МКД
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Технические паспорта, протоколы ОСС, акты сезонных осмотров и выгрузки в ГИС ЖКХ
          </p>
        </div>

        <button
          type="button"
          onClick={() => showToast('Загрузка новых файлов доступна уполномоченным инженерам УК', 'info')}
          className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span>Загрузить документ</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block leading-tight">{documents.length}</span>
            <span className="text-xs text-slate-500 font-medium">Документов в защищенном хранилище</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-emerald-600 block leading-tight">100%</span>
            <span className="text-xs text-slate-500 font-medium">Синхронизация с ГИС ЖКХ РФ</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
            </svg>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block leading-tight">142 МБ</span>
            <span className="text-xs text-slate-500 font-medium">Объем архива (из 10 ГБ лимита)</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              categoryFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Все файлы
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('passport')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              categoryFilter === 'passport'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Техпаспорта
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('act')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              categoryFilter === 'act'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Акты осмотра
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('protocol')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              categoryFilter === 'protocol'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Протоколы ОСС
          </button>
        </div>

        <div className="flex items-center gap-2">
          {houses.length > 0 && (
            <select
              value={houseFilter ?? ''}
              onChange={(e) => setHouseFilter(e.target.value ? Number(e.target.value) : undefined)}
              className="h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Все дома</option>
              {houses.map((h) => (
                <option key={h.id} value={h.id}>{h.address}</option>
              ))}
            </select>
          )}

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию..."
              className="h-9 pl-8 pr-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-52 shadow-xs"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Документ</th>
                <th className="py-3 px-4">Объект МКД</th>
                <th className="py-3 px-4">Формат</th>
                <th className="py-3 px-4">Размер файла</th>
                <th className="py-3 px-4">Дата загрузки</th>
                <th className="py-3 px-4 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Загрузка электронного архива...
                  </td>
                </tr>
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Документы не найдены
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-xs text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <span className="block truncate font-bold">{doc.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">Верифицированная копия</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                      {doc.house_address}
                    </td>

                    <td className="py-3.5 px-4">
                      {getFormatBadge(doc.mime_type, doc.title)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">
                      {formatFileSize(doc.size)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-xs">
                      {formatDate(doc.created_at)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={doc.file_url}
                        download
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold transition cursor-pointer shadow-xs"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Скачать</span>
                      </a>
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

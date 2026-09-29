import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ukApi } from '../../api';
import { formatDate } from '../../../../shared/lib/formatDate';
import { useToast } from '../../../../shared/hooks/useToast';

export const DocumentsPage: React.FC = () => {
  const { showToast } = useToast();
  const [houseFilter] = useState<number | undefined>(undefined);

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['uk-documents', houseFilter],
    queryFn: () => ukApi.getDocuments(houseFilter),
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Электронный архив документов МКД
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Технические паспорта, акты сезонных осмотров, договоры управления и протоколы ОСС
          </p>
        </div>

        <button
          type="button"
          onClick={() => showToast('Функция загрузки файлов доступна для диспетчера', 'info')}
          className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">upload_file</span>
          <span>Загрузить документ</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Документ</th>
                <th className="py-3 px-4">Дом</th>
                <th className="py-3 px-4">Размер</th>
                <th className="py-3 px-4">Формат</th>
                <th className="py-3 px-4">Дата загрузки</th>
                <th className="py-3 px-4 text-right">Скачать</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Загрузка документов...
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    В электронном архиве пока нет документов
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-rose-500 text-[22px]">
                        picture_as_pdf
                      </span>
                      <span>{doc.title}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{doc.house_address}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">
                      {formatFileSize(doc.size)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono font-medium">
                        {doc.mime_type.split('/')[1]?.toUpperCase() || 'PDF'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[13px]">
                      {formatDate(doc.created_at)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={doc.file_url}
                        download
                        className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-semibold"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
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

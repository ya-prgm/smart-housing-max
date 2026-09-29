import React from 'react';
import { useHaptic } from '../../../../shared/hooks/useHaptic';

export interface RecipientOption {
  id: string;
  code: string;
  name: string;
  role: string;
  icon: string;
  checked: boolean;
}

interface RecipientSelectorProps {
  recipients: RecipientOption[];
  topicTitle?: string;
  onToggle: (id: string) => void;
  isLoading?: boolean;
}

export const RecipientSelector: React.FC<RecipientSelectorProps> = ({
  recipients,
  topicTitle,
  onToggle,
  isLoading = false,
}) => {
  const { impact } = useHaptic();

  const handleToggle = (id: string) => {
    impact('light');
    onToggle(id);
  };

  const selectedCount = recipients.filter((r) => r.checked).length;

  return (
    <div className="flex flex-col gap-space-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">
            2
          </span>
          <label className="font-label-lg text-label-lg text-on-surface font-semibold">
            Адресаты по классификатору
          </label>
        </div>
        <span className="font-label-sm text-label-sm text-outline">
          Выбрано: {selectedCount} из {recipients.length}
        </span>
      </div>

      {topicTitle && (
        <p className="font-body-sm text-body-sm text-on-surface-variant -mt-1">
          Для темы «{topicTitle}» автоматически подобраны регламентные инстанции. Отметьте нужные:
        </p>
      )}

      {isLoading ? (
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center gap-2 text-xs text-on-surface-variant">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Загрузка адресатов из классификатора...</span>
        </div>
      ) : recipients.length > 0 ? (
        <div className="grid grid-cols-1 gap-2" id="recipients-list">
          {recipients.map((r) => (
            <div
              key={r.id}
              onClick={() => handleToggle(r.id)}
              className={`cursor-pointer flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-lowest border-2 shadow-xs transition-all select-none ${
                r.checked ? 'border-primary' : 'border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed/50 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[22px]">
                    {r.icon || 'corporate_fare'}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                    {r.name}
                  </h3>
                  <p className="text-[12px] text-on-surface-variant truncate">
                    {r.role || 'Регламентная организация'}
                  </p>
                </div>
              </div>

              <div className="relative shrink-0 ml-2">
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    r.checked
                      ? 'border-primary bg-primary text-on-primary'
                      : 'border-outline-variant bg-surface-container-lowest text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-center text-on-surface-variant font-body-sm text-body-sm">
          Выберите тему классификатора выше для автоматического подбора адресатов
        </div>
      )}
    </div>
  );
};

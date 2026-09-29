export const PROVIDER_CATEGORIES: Record<string, string> = {
  heating: 'Отопление и ГВС',
  water: 'Холодное водоснабжение',
  electricity: 'Электроснабжение',
  internet: 'Интернет и ТВ',
  intercom: 'Домофонная связь',
  municipal: 'Коммунальные услуги',
};

export const NOTIFICATION_CATEGORIES = {
  ALL: 'all',
  SYSTEM: 'system',
  CHAIRMAN: 'chairman',
  UK: 'uk',
} as const;

export const POST_TYPES = {
  ANNOUNCEMENT: 'announcement',
  REPORT: 'report',
  INFO: 'info',
  EMERGENCY: 'emergency',
} as const;

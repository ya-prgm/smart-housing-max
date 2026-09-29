export const USER_ROLES = {
  RESIDENT: 'resident',
  CHAIRMAN: 'chairman',
  UK_STAFF: 'uk_staff',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  resident: 'Житель',
  chairman: 'Председатель',
  uk_staff: 'Сотрудник УК',
};

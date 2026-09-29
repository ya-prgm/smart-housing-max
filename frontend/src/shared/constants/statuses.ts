export const TICKET_STATUSES = {
  ACTIVE: 'active',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
} as const;

export const TICKET_STATUS_LABELS: Record<string, string> = {
  active: 'Новая',
  in_progress: 'В работе',
  completed: 'Выполнена',
  rejected: 'Отклонена',
};

export const POLL_STATUSES = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

export const POLL_STATUS_LABELS: Record<string, string> = {
  draft: 'Черновик',
  active: 'Активен',
  completed: 'Завершён',
  archived: 'В архиве',
};

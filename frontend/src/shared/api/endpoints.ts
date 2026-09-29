export const ENDPOINTS = {
  AUTH: {
    MAX_LOGIN: '/auth/max-login',
    ESIA_LOGIN: '/auth/esia-login',
    ESIA_SYNC: '/auth/esia-sync',
    ESIA_UNLINK: '/auth/esia-unlink',
    REFRESH: '/auth/refresh',
    PIN_SETUP: '/auth/pin/setup',
    PIN_VERIFY: '/auth/pin/verify',
    PIN_RESET: '/auth/pin/reset',
  },
  USERS: {
    ME: '/users/me',
  },
  HOUSES: {
    MY: '/houses/my',
    BY_ID: (id: number | string) => `/houses/${id}`,
  },
  TICKETS: {
    LIST: '/tickets',
    BY_ID: (id: number | string) => `/tickets/${id}`,
    SUPPORT: (id: number | string) => `/tickets/${id}/support`,
  },
  TOPICS: {
    LIST: '/topics',
    SEARCH: '/topics/search',
    BY_CODE: (code: string) => `/topics/${code}`,
  },
  FEED: {
    LIST: '/feed',
    BY_ID: (id: number | string) => `/feed/${id}`,
    REACTIONS: (id: number | string) => `/feed/${id}/reactions`,
    COMMENTS: (id: number | string) => `/feed/${id}/comments`,
    DELETE_COMMENT: (id: number | string) => `/feed/comments/${id}`,
  },
  VOTES: {
    LIST: '/votes',
    BY_ID: (id: number | string) => `/votes/${id}`,
    SUBMIT: (id: number | string) => `/votes/${id}/submit`,
  },
  FILES: {
    UPLOAD: '/files/upload',
    DOWNLOAD: (id: number | string) => `/files/${id}`,
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_ALL_READ: '/notifications/mark-all-read',
  },
  UK: {
    DASHBOARD: '/uk/dashboard',
    HOUSES: '/uk/houses',
    RESIDENTS: '/uk/residents',
    UPDATE_RESIDENT: (id: number | string) => `/uk/residents/${id}`,
    TICKETS: '/uk/tickets',
    UPDATE_TICKET_STATUS: (id: number | string) => `/uk/tickets/${id}/status`,
    FEED: '/uk/feed',
    VOTES: '/uk/votes',
    VOTE_STATUS: (id: number | string) => `/uk/votes/${id}/status`,
    DOCUMENTS: '/uk/documents',
    JOURNAL: '/uk/journal',
  },
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  LANDS: {
    LIST: '/lands',
    CREATE: '/lands',
    GET: (id: string) => `/lands/${id}`,
    UPDATE: (id: string) => `/lands/${id}`,
    DELETE: (id: string) => `/lands/${id}`,
    SEARCH: '/lands/search',
  },
  EVENTS: {
    LIST: '/events',
    CREATE: '/events',
    GET: (id: string) => `/events/${id}`,
    UPDATE: (id: string) => `/events/${id}`,
    DELETE: (id: string) => `/events/${id}`,
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
} as const;

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  DATA_ENTRY: 'data_entry',
  VIEW_ONLY: 'view_only',
} as const;

export const PERMISSIONS = {
  LANDS_VIEW: 'lands:view',
  LANDS_CREATE: 'lands:create',
  LANDS_UPDATE: 'lands:update',
  LANDS_DELETE: 'lands:delete',
  EVENTS_VIEW: 'events:view',
  EVENTS_CREATE: 'events:create',
  EVENTS_UPDATE: 'events:update',
  EVENTS_DELETE: 'events:delete',
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
} as const;

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.LANDS_VIEW,
    PERMISSIONS.LANDS_CREATE,
    PERMISSIONS.LANDS_UPDATE,
    PERMISSIONS.EVENTS_VIEW,
    PERMISSIONS.EVENTS_CREATE,
    PERMISSIONS.EVENTS_UPDATE,
    PERMISSIONS.USERS_VIEW,
  ],
  [ROLES.DATA_ENTRY]: [
    PERMISSIONS.LANDS_VIEW,
    PERMISSIONS.LANDS_CREATE,
    PERMISSIONS.LANDS_UPDATE,
    PERMISSIONS.EVENTS_VIEW,
  ],
  [ROLES.VIEW_ONLY]: [
    PERMISSIONS.LANDS_VIEW,
    PERMISSIONS.EVENTS_VIEW,
  ],
} as const;

export const LAND_TYPES = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'agricultural', label: 'Agricultural' },
  { value: 'industrial', label: 'Industrial' },
] as const;

export const SRI_LANKA_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle',
  'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle',
  'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala',
  'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
  'Trincomalee', 'Vavuniya'
] as const;

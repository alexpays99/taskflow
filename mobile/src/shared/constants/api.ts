export const API_CONFIG = {
  baseUrl: __DEV__ ? 'http://localhost:3000' : 'https://api.taskflow.app',
  timeout: 30000,
} as const;

export const ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
  },
  users: {
    me: '/users/me',
    avatar: '/users/me/avatar',
  },
  tasks: {
    list: '/tasks',
    byId: (id: string) => `/tasks/${id}`,
    complete: (id: string) => `/tasks/${id}/complete`,
  },
} as const;

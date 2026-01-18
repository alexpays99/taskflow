import Config from 'react-native-config';

export const API_CONFIG = {
  baseUrl: Config.API_URL || 'http://localhost:3000',
  timeout: 30000,
  env: Config.ENV || 'development',
  appName: Config.APP_NAME || 'TaskFlow',
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

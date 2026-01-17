import apiClient from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/constants';
import { Tokens, User, LoginFormData, RegisterFormData } from '../types';

export const authApi = {
  login: async (data: LoginFormData): Promise<Tokens> => {
    const response = await apiClient.post<Tokens>(ENDPOINTS.auth.login, data);
    return response.data;
  },

  register: async (data: RegisterFormData): Promise<Tokens> => {
    const response = await apiClient.post<Tokens>(ENDPOINTS.auth.register, data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(ENDPOINTS.auth.logout);
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>(ENDPOINTS.users.me);
    return response.data;
  },
};

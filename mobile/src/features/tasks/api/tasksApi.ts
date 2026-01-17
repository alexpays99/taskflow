import apiClient from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/constants';
import {
  Task,
  PaginatedTasks,
  TasksQueryParams,
  CreateTaskFormData,
  UpdateTaskFormData,
} from '../types';

export const tasksApi = {
  getTasks: async (params?: TasksQueryParams): Promise<PaginatedTasks> => {
    const response = await apiClient.get<PaginatedTasks>(ENDPOINTS.tasks.list, {
      params,
    });
    return response.data;
  },

  getTask: async (id: string): Promise<Task> => {
    const response = await apiClient.get<Task>(ENDPOINTS.tasks.byId(id));
    return response.data;
  },

  createTask: async (data: CreateTaskFormData): Promise<Task> => {
    const response = await apiClient.post<Task>(ENDPOINTS.tasks.list, data);
    return response.data;
  },

  updateTask: async (id: string, data: UpdateTaskFormData): Promise<Task> => {
    const response = await apiClient.patch<Task>(ENDPOINTS.tasks.byId(id), data);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.tasks.byId(id));
  },

  completeTask: async (id: string): Promise<Task> => {
    const response = await apiClient.patch<Task>(ENDPOINTS.tasks.complete(id));
    return response.data;
  },
};

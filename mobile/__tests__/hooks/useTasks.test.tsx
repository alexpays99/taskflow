import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useTasks, useCreateTask, useCompleteTask } from '@/features/tasks/hooks/useTasks';
import { tasksApi } from '@/features/tasks/api/tasksApi';

jest.mock('@/features/tasks/api/tasksApi');

const mockTasksApi = tasksApi as jest.Mocked<typeof tasksApi>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch tasks successfully', async () => {
    const mockTasks = {
      data: [
        {
          id: '1',
          title: 'Test Task',
          description: 'Test description',
          isCompleted: false,
          priority: 'MEDIUM' as const,
          dueDate: null,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          userId: 'user-1',
        },
      ],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };

    mockTasksApi.getTasks.mockResolvedValue(mockTasks);

    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockTasks);
    expect(mockTasksApi.getTasks).toHaveBeenCalledWith(undefined);
  });

  it('should fetch tasks with filters', async () => {
    const mockTasks = {
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };

    mockTasksApi.getTasks.mockResolvedValue(mockTasks);

    const params = { priority: 'HIGH' as const, isCompleted: false };
    const { result } = renderHook(() => useTasks(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockTasksApi.getTasks).toHaveBeenCalledWith(params);
  });

  it('should handle error when fetching tasks', async () => {
    mockTasksApi.getTasks.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe('useCreateTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a task successfully', async () => {
    const newTask = {
      id: '1',
      title: 'New Task',
      description: 'Description',
      isCompleted: false,
      priority: 'MEDIUM' as const,
      dueDate: null,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      userId: 'user-1',
    };

    mockTasksApi.createTask.mockResolvedValue(newTask);

    const { result } = renderHook(() => useCreateTask(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ title: 'New Task', priority: 'MEDIUM' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockTasksApi.createTask).toHaveBeenCalledWith({
      title: 'New Task',
      priority: 'MEDIUM',
    });
  });
});

describe('useCompleteTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete a task successfully', async () => {
    const completedTask = {
      id: '1',
      title: 'Task',
      description: null,
      isCompleted: true,
      priority: 'MEDIUM' as const,
      dueDate: null,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      userId: 'user-1',
    };

    mockTasksApi.completeTask.mockResolvedValue(completedTask);

    const { result } = renderHook(() => useCompleteTask(), {
      wrapper: createWrapper(),
    });

    result.current.mutate('1');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockTasksApi.completeTask).toHaveBeenCalledWith('1');
  });
});

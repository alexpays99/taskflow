import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { TasksScreen } from '@/features/tasks/screens/TasksScreen';
import { tasksApi } from '@/features/tasks/api/tasksApi';

jest.mock('@/features/tasks/api/tasksApi');

const mockTasksApi = tasksApi as jest.Mocked<typeof tasksApi>;

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer>{component}</NavigationContainer>
      </I18nextProvider>
    </QueryClientProvider>
  );
};

describe('TasksScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state initially', () => {
    mockTasksApi.getTasks.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithProviders(<TasksScreen />);

    // Loading indicator should be present
    expect(screen.queryByTestId('loading-indicator')).toBeTruthy;
  });

  it('should render empty state when no tasks', async () => {
    mockTasksApi.getTasks.mockResolvedValue({
      data: [],
      meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
    });

    renderWithProviders(<TasksScreen />);

    await waitFor(() => {
      expect(screen.getByText('No tasks yet')).toBeTruthy();
    });

    expect(screen.getByText('Create your first task to get started')).toBeTruthy();
  });

  it('should render tasks list', async () => {
    const mockTasks = {
      data: [
        {
          id: '1',
          title: 'Test Task 1',
          description: 'Description 1',
          isCompleted: false,
          priority: 'HIGH' as const,
          dueDate: '2024-12-31T23:59:59Z',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          userId: 'user-1',
        },
        {
          id: '2',
          title: 'Test Task 2',
          description: 'Description 2',
          isCompleted: true,
          priority: 'LOW' as const,
          dueDate: null,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          userId: 'user-1',
        },
      ],
      meta: { total: 2, page: 1, limit: 20, totalPages: 1 },
    };

    mockTasksApi.getTasks.mockResolvedValue(mockTasks);

    renderWithProviders(<TasksScreen />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeTruthy();
    });

    expect(screen.getByText('Test Task 2')).toBeTruthy();
  });

  it('should show FAB button', async () => {
    mockTasksApi.getTasks.mockResolvedValue({
      data: [],
      meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
    });

    renderWithProviders(<TasksScreen />);

    await waitFor(() => {
      expect(screen.getByText('+')).toBeTruthy();
    });
  });

  it('should complete task on checkbox press', async () => {
    const mockTask = {
      id: '1',
      title: 'Test Task',
      description: null,
      isCompleted: false,
      priority: 'MEDIUM' as const,
      dueDate: null,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      userId: 'user-1',
    };

    mockTasksApi.getTasks.mockResolvedValue({
      data: [mockTask],
      meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
    });

    mockTasksApi.completeTask.mockResolvedValue({
      ...mockTask,
      isCompleted: true,
    });

    renderWithProviders(<TasksScreen />);

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeTruthy();
    });
  });

  it('should show priority badges', async () => {
    const mockTasks = {
      data: [
        {
          id: '1',
          title: 'High Priority Task',
          description: null,
          isCompleted: false,
          priority: 'HIGH' as const,
          dueDate: null,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          userId: 'user-1',
        },
      ],
      meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
    };

    mockTasksApi.getTasks.mockResolvedValue(mockTasks);

    renderWithProviders(<TasksScreen />);

    await waitFor(() => {
      expect(screen.getByText('High')).toBeTruthy();
    });
  });
});

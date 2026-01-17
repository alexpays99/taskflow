import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { useAuthStore } from '@/features/auth/stores/authStore';

jest.mock('@/features/auth/stores/authStore', () => ({
  useAuthStore: jest.fn(),
}));

const mockLogin = jest.fn();
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: false,
    } as any);
  });

  it('should initialize with empty form values', () => {
    const { result } = renderHook(() => useLogin());

    expect(result.current.form.getValues().email).toBe('');
    expect(result.current.form.getValues().password).toBe('');
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should update email value', () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.form.setValue('email', 'test@example.com');
    });

    expect(result.current.form.getValues().email).toBe('test@example.com');
  });

  it('should update password value', () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.form.setValue('password', 'password123');
    });

    expect(result.current.form.getValues().password).toBe('password123');
  });

  it('should validate email format', async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.form.setValue('email', 'invalid-email');
      result.current.form.setValue('password', 'password123');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should validate password length', async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.form.setValue('email', 'test@example.com');
      result.current.form.setValue('password', 'short');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should call login with valid data', async () => {
    mockLogin.mockResolvedValue(undefined);
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.form.setValue('email', 'test@example.com');
      result.current.form.setValue('password', 'password123');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should set error on login failure', async () => {
    const error = new Error('Invalid credentials');
    (error as any).response = { status: 401 };
    mockLogin.mockRejectedValue(error);

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.form.setValue('email', 'test@example.com');
      result.current.form.setValue('password', 'password123');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });
});

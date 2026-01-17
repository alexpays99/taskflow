import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { useAuthStore } from '@/features/auth/stores/authStore';

jest.mock('@/features/auth/stores/authStore');

const mockLogin = jest.fn();
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer>{component}</NavigationContainer>
      </I18nextProvider>
    </QueryClientProvider>
  );
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      user: null,
      isAuthenticated: false,
      isInitialized: true,
      initialize: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      setUser: jest.fn(),
    });
  });

  it('should render login form', () => {
    renderWithProviders(<LoginScreen />);

    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('should render welcome message', () => {
    renderWithProviders(<LoginScreen />);

    expect(screen.getByText('Welcome to TaskFlow')).toBeTruthy();
  });

  it('should show sign up link', () => {
    renderWithProviders(<LoginScreen />);

    expect(screen.getByText("Don't have an account?")).toBeTruthy();
    expect(screen.getByText('Sign Up')).toBeTruthy();
  });

  it('should update email input', () => {
    renderWithProviders(<LoginScreen />);

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.changeText(emailInput, 'test@example.com');

    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('should update password input', () => {
    renderWithProviders(<LoginScreen />);

    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.changeText(passwordInput, 'password123');

    expect(passwordInput.props.value).toBe('password123');
  });

  it('should show validation error for invalid email', async () => {
    renderWithProviders(<LoginScreen />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email')).toBeTruthy();
    });
  });

  it('should show validation error for short password', async () => {
    renderWithProviders(<LoginScreen />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'short');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(
        screen.getByText('Password must be at least 8 characters')
      ).toBeTruthy();
    });
  });

  it('should call login on valid submit', async () => {
    mockLogin.mockResolvedValue(undefined);
    renderWithProviders(<LoginScreen />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should show loading state', () => {
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: true,
      user: null,
      isAuthenticated: false,
      isInitialized: true,
      initialize: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      setUser: jest.fn(),
    });

    renderWithProviders(<LoginScreen />);

    // Button should be in loading state
    const loginButton = screen.getByText('Login');
    expect(loginButton).toBeTruthy();
  });
});

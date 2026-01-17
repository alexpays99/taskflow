import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useAuthStore } from '../stores/authStore';
import { LoginFormData, loginSchema } from '../types';
import { handleApiError } from '@/shared/api/errorHandler';

export function useLogin() {
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuthStore();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = useCallback(
    async (data: LoginFormData) => {
      setError(null);
      try {
        await login(data);
      } catch (e) {
        const apiError = handleApiError(e as AxiosError);
        setError(apiError.message);
      }
    },
    [login]
  );

  const onSubmit = form.handleSubmit(handleLogin);

  return {
    form,
    error,
    isLoading,
    onSubmit,
  };
}

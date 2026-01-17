import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useAuthStore } from '../stores/authStore';
import { RegisterFormData, registerSchema } from '../types';
import { handleApiError } from '@/shared/api/errorHandler';

export function useRegister() {
  const [error, setError] = useState<string | null>(null);
  const { register, isLoading } = useAuthStore();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const handleRegister = useCallback(
    async (data: RegisterFormData) => {
      setError(null);
      try {
        await register(data);
      } catch (e) {
        const apiError = handleApiError(e as AxiosError);
        setError(apiError.message);
      }
    },
    [register]
  );

  const onSubmit = form.handleSubmit(handleRegister);

  return {
    form,
    error,
    isLoading,
    onSubmit,
  };
}

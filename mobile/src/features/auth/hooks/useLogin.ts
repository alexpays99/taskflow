import { handleApiError } from "@/shared/api/errorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../stores/authStore";
import { LoginFormData, loginSchema } from "../types";

export function useLogin() {
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuthStore();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = useCallback(
    async (data: LoginFormData) => {
      setError(null);
      try {
        await login(data);
      } catch (e) {
        if (e instanceof Error) {
          const apiError = handleApiError(e as AxiosError<unknown>);
          setError(apiError.message);
        }
      }
    },
    [login],
  );

  const onSubmit = form.handleSubmit(handleLogin);

  return {
    form,
    error,
    isLoading,
    onSubmit,
  };
}

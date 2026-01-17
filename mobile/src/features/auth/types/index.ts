import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('auth.validation.emailInvalid'),
  password: z.string().min(8, 'auth.validation.passwordTooShort'),
});

export const registerSchema = z.object({
  email: z.string().email('auth.validation.emailInvalid'),
  password: z.string().min(8, 'auth.validation.passwordTooShort'),
  name: z.string().min(1, 'auth.validation.nameRequired').optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

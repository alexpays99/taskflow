import { tokenStorage } from "@/shared/utils/storage";
import { create } from "zustand";
import { authApi } from "../api/authApi";
import { LoginFormData, RegisterFormData, User } from "../types";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  initialize: () => Promise<void>;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      set({ isInitialized: true });
      return;
    }

    try {
      const user = await authApi.getProfile();
      set({ user, isAuthenticated: true, isInitialized: true });
    } catch {
      tokenStorage.clearTokens();
      set({ isInitialized: true });
    }
  },

  login: async (data: LoginFormData) => {
    set({ isLoading: true });
    try {
      const tokens = await authApi.login(data);
      tokenStorage.setAccessToken(tokens.accessToken);
      tokenStorage.setRefreshToken(tokens.refreshToken);

      const user = await authApi.getProfile();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data: RegisterFormData) => {
    set({ isLoading: true });
    try {
      const tokens = await authApi.register(data);
      tokenStorage.setAccessToken(tokens.accessToken);
      tokenStorage.setRefreshToken(tokens.refreshToken);

      const user = await authApi.getProfile();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    } finally {
      tokenStorage.clearTokens();
      set({ user: null, isAuthenticated: false });
    }
  },

  setUser: (user: User | null) => set({ user }),
}));

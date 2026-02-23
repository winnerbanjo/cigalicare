import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/api/auth.api';
import { Provider, User } from '@/types/auth';

interface RegisterInput {
  providerName: string;
  providerPhone?: string;
  name: string;
  email: string;
  password: string;
  role: 'doctor' | 'pharmacy' | 'admin';
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  provider: Provider | null;
  isLoading: boolean;
  error: string | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const persistKey = 'cigali_auth_store';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      provider: null,
      isLoading: false,
      error: null,

      login: async (input) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authApi.login(input);
          localStorage.setItem('cigali_token', result.token);
          set({ token: result.token, user: result.user, provider: result.provider, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to login';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      register: async (input) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authApi.register(input);
          localStorage.setItem('cigali_token', result.token);
          set({ token: result.token, user: result.user, provider: result.provider, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to register';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('cigali_token');
        set({ token: null, user: null, provider: null, error: null });
      },

      clearError: () => set({ error: null })
    }),
    { name: persistKey }
  )
);

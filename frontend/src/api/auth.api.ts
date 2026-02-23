import { apiClient } from './client';
import { ApiResponse } from '@/types/api';
import { AuthResponse, UserRole } from '@/types/auth';

interface RegisterPayload {
  providerName: string;
  providerPhone?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface LoginPayload {
  email: string;
  password: string;
}

const normalizeAuthResponse = (payload: unknown): AuthResponse => {
  const body = payload as { data?: AuthResponse; token?: string; user?: AuthResponse['user']; provider?: AuthResponse['provider'] };
  if (body.data) {
    return body.data;
  }

  return {
    token: body.token ?? '',
    user: body.user as AuthResponse['user'],
    provider: body.provider as AuthResponse['provider']
  };
};

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', payload);
    return normalizeAuthResponse(data);
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post('/auth/login', payload);
    return normalizeAuthResponse(data);
  }
};

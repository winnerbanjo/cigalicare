export type UserRole = 'doctor' | 'pharmacy' | 'admin';

export interface User {
  id: string;
  providerId: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Provider {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subscriptionPlan: 'starter' | 'growth' | 'enterprise';
}

export interface AuthResponse {
  token: string;
  user: User;
  provider: Provider;
}

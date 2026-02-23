export interface ProviderProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subscriptionPlan: 'starter' | 'growth' | 'enterprise';
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

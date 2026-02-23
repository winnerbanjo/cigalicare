import { apiClient } from './client';
import { ApiResponse } from '@/types/api';
import { ProviderProfile } from '@/types/provider';

export const providersApi = {
  async getMyProfile(): Promise<ProviderProfile> {
    const { data } = await apiClient.get<ApiResponse<ProviderProfile>>('/providers/me/profile');
    return data.data;
  },

  async updateMyProfile(payload: Partial<ProviderProfile>): Promise<ProviderProfile> {
    const { data } = await apiClient.put<ApiResponse<ProviderProfile>>('/providers/me/profile', payload);
    return data.data;
  },

  async uploadLogo(imageBase64: string): Promise<ProviderProfile> {
    const { data } = await apiClient.post<ApiResponse<ProviderProfile>>('/providers/me/logo', {
      imageBase64
    });
    return data.data;
  }
};

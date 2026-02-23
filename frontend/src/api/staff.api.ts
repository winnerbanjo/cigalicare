import { apiClient } from './client';
import { ApiResponse } from '@/types/api';
import { StaffMember } from '@/types/staff';

export const staffApi = {
  async getAll(): Promise<StaffMember[]> {
    const { data } = await apiClient.get<ApiResponse<StaffMember[]>>('/staff');
    return data.data;
  }
};

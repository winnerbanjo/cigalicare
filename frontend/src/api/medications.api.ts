import { apiClient } from './client';
import { ApiResponse } from '@/types/api';
import { Medication, MedicationInput } from '@/types/medication';

export const medicationsApi = {
  async getAll(): Promise<Medication[]> {
    const { data } = await apiClient.get<ApiResponse<Medication[]>>('/medications');
    return data.data;
  },

  async create(payload: MedicationInput): Promise<Medication> {
    const { data } = await apiClient.post<ApiResponse<Medication>>('/medications', payload);
    return data.data;
  },

  async update(id: string, payload: MedicationInput): Promise<Medication> {
    const { data } = await apiClient.put<ApiResponse<Medication>>(`/medications/${id}`, payload);
    return data.data;
  }
};

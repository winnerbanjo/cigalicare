import { apiClient } from './client';
import { ApiResponse } from '@/types/api';
import { Patient, PatientInput } from '@/types/patient';

export const patientsApi = {
  async getAll(): Promise<Patient[]> {
    const { data } = await apiClient.get<ApiResponse<Patient[]>>('/patients');
    return data.data;
  },

  async getById(id: string): Promise<Patient> {
    const { data } = await apiClient.get<ApiResponse<Patient>>(`/patients/${id}`);
    return data.data;
  },

  async create(payload: PatientInput): Promise<Patient> {
    const { data } = await apiClient.post<ApiResponse<Patient>>('/patients', payload);
    return data.data;
  },

  async update(id: string, payload: PatientInput): Promise<Patient> {
    const { data } = await apiClient.put<ApiResponse<Patient>>(`/patients/${id}`, payload);
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/patients/${id}`);
  }
};

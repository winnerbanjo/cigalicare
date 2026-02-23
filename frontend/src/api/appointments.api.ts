import { apiClient } from './client';
import { ApiResponse } from '@/types/api';
import { Appointment, AppointmentInput } from '@/types/appointment';

export const appointmentsApi = {
  async getAll(): Promise<Appointment[]> {
    const { data } = await apiClient.get<ApiResponse<Appointment[]>>('/appointments');
    return data.data;
  },

  async getById(id: string): Promise<Appointment> {
    const { data } = await apiClient.get<ApiResponse<Appointment>>(`/appointments/${id}`);
    return data.data;
  },

  async create(payload: AppointmentInput): Promise<Appointment> {
    const { data } = await apiClient.post<ApiResponse<Appointment>>('/appointments', payload);
    return data.data;
  },

  async update(id: string, payload: AppointmentInput): Promise<Appointment> {
    const { data } = await apiClient.put<ApiResponse<Appointment>>(`/appointments/${id}`, payload);
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/appointments/${id}`);
  }
};

import { apiClient } from './client';
import { ApiResponse } from '@/types/api';
import { BillingSummary, Invoice } from '@/types/billing';

export const billingApi = {
  async getInvoices(): Promise<Invoice[]> {
    const { data } = await apiClient.get<ApiResponse<Invoice[]>>('/billing/invoices');
    return data.data;
  },

  async getSummary(): Promise<BillingSummary> {
    const { data } = await apiClient.get<ApiResponse<BillingSummary>>('/billing/summary');
    return data.data;
  }
};

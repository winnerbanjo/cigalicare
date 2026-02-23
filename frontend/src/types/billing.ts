export interface Invoice {
  _id: string;
  providerId: string;
  invoiceNumber: string;
  amount: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidAt?: string;
  patientId:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
      };
  createdAt: string;
  updatedAt: string;
}

export interface BillingSummary {
  totalRevenue: number;
  pending: number;
  overdue: number;
  count: number;
}

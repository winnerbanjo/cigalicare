import { InvoiceModel } from '../models/Invoice';

export const billingService = {
  async getInvoices(providerId: string) {
    return InvoiceModel.find({ providerId })
      .populate('patientId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .lean();
  },

  async getSummary(providerId: string) {
    const invoices = await InvoiceModel.find({ providerId }).lean();

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const pending = invoices.filter((inv) => inv.status === 'pending').length;
    const overdue = invoices.filter((inv) => inv.status === 'overdue').length;

    return {
      totalRevenue,
      pending,
      overdue,
      count: invoices.length
    };
  }
};

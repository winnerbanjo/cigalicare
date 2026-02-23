import { Request, Response } from 'express';
import { billingService } from '../services/billing.service';
import { AppError } from '../utils/appError';

const getAuthUser = (req: Request): Express.AuthUser => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }
  return req.user;
};

export const billingController = {
  async getInvoices(req: Request, res: Response): Promise<void> {
    const invoices = await billingService.getInvoices(getAuthUser(req).providerId);
    res.json({ success: true, data: invoices });
  },

  async getSummary(req: Request, res: Response): Promise<void> {
    const summary = await billingService.getSummary(getAuthUser(req).providerId);
    res.json({ success: true, data: summary });
  }
};

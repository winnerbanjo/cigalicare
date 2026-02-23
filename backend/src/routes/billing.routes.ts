import { Router } from 'express';
import { billingController } from '../controllers/billing.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { allowRoles } from '../middleware/rbac.middleware';
import { asyncHandler } from '../utils/asyncHandler';

export const billingRouter = Router();

billingRouter.use(authMiddleware);
billingRouter.use(allowRoles('admin', 'doctor', 'pharmacy'));

billingRouter.get('/invoices', asyncHandler(billingController.getInvoices));
billingRouter.get('/summary', asyncHandler(billingController.getSummary));

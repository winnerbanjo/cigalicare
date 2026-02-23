import { Router } from 'express';
import { staffController } from '../controllers/staff.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { allowRoles } from '../middleware/rbac.middleware';
import { asyncHandler } from '../utils/asyncHandler';

export const staffRouter = Router();

staffRouter.use(authMiddleware);
staffRouter.use(allowRoles('admin', 'doctor', 'pharmacy'));

staffRouter.get('/', asyncHandler(staffController.getAll));

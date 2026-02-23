import { Router } from 'express';
import { medicationController } from '../controllers/medication.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { allowRoles } from '../middleware/rbac.middleware';
import { validateObjectId } from '../middleware/validateObjectId.middleware';
import { asyncHandler } from '../utils/asyncHandler';

export const medicationRouter = Router();

medicationRouter.use(authMiddleware);
medicationRouter.use(allowRoles('pharmacy', 'doctor', 'admin'));

medicationRouter.post('/', asyncHandler(medicationController.create));
medicationRouter.get('/', asyncHandler(medicationController.getAll));
medicationRouter.put('/:id', validateObjectId(), asyncHandler(medicationController.update));

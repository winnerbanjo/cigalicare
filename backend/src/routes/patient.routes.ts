import { Router } from 'express';
import { patientController } from '../controllers/patient.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { allowRoles } from '../middleware/rbac.middleware';
import { validateObjectId } from '../middleware/validateObjectId.middleware';
import { asyncHandler } from '../utils/asyncHandler';

export const patientRouter = Router();

patientRouter.use(authMiddleware);
patientRouter.use(allowRoles('doctor', 'pharmacy', 'admin'));

patientRouter.post('/', asyncHandler(patientController.create));
patientRouter.get('/', asyncHandler(patientController.getAll));
patientRouter.get('/:id', validateObjectId(), asyncHandler(patientController.getById));
patientRouter.put('/:id', validateObjectId(), asyncHandler(patientController.update));
patientRouter.delete('/:id', validateObjectId(), asyncHandler(patientController.remove));

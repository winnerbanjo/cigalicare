import { Router } from 'express';
import { appointmentController } from '../controllers/appointment.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { allowRoles } from '../middleware/rbac.middleware';
import { validateObjectId } from '../middleware/validateObjectId.middleware';
import { asyncHandler } from '../utils/asyncHandler';

export const appointmentRouter = Router();

appointmentRouter.use(authMiddleware);
appointmentRouter.use(allowRoles('doctor', 'pharmacy', 'admin'));

appointmentRouter.post('/', asyncHandler(appointmentController.create));
appointmentRouter.get('/', asyncHandler(appointmentController.getAll));
appointmentRouter.get('/:id', validateObjectId(), asyncHandler(appointmentController.getById));
appointmentRouter.put('/:id', validateObjectId(), asyncHandler(appointmentController.update));
appointmentRouter.delete('/:id', validateObjectId(), asyncHandler(appointmentController.remove));

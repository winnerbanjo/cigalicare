import { Router } from 'express';
import { providerController } from '../controllers/provider.controller';
import { validateObjectId } from '../middleware/validateObjectId.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { authMiddleware } from '../middleware/auth.middleware';
import { allowRoles } from '../middleware/rbac.middleware';

export const providerRouter = Router();

providerRouter.get('/:id/public-profile', validateObjectId(), asyncHandler(providerController.getPublicProfile));

providerRouter.use(authMiddleware);
providerRouter.use(allowRoles('admin', 'doctor', 'pharmacy'));

providerRouter.get('/me/profile', asyncHandler(providerController.getMyProvider));
providerRouter.put('/me/profile', asyncHandler(providerController.updateMyProvider));
providerRouter.post('/me/logo', asyncHandler(providerController.uploadMyLogo));

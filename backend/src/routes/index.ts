import { Router } from 'express';
import { authRouter } from './auth.routes';
import { patientRouter } from './patient.routes';
import { appointmentRouter } from './appointment.routes';
import { providerRouter } from './provider.routes';
import { medicationRouter } from './medication.routes';
import { billingRouter } from './billing.routes';
import { staffRouter } from './staff.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/patients', patientRouter);
apiRouter.use('/appointments', appointmentRouter);
apiRouter.use('/providers', providerRouter);
apiRouter.use('/medications', medicationRouter);
apiRouter.use('/billing', billingRouter);
apiRouter.use('/staff', staffRouter);

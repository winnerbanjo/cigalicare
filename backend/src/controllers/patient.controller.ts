import { Request, Response } from 'express';
import { AppError } from '../utils/appError';
import { patientService } from '../services/patient.service';

const requireAuthUser = (req: Request): Express.AuthUser => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }
  return req.user;
};

export const patientController = {
  async create(req: Request, res: Response): Promise<void> {
    const patient = await patientService.create(requireAuthUser(req), req.body);
    res.status(201).json({ success: true, data: patient });
  },

  async getAll(req: Request, res: Response): Promise<void> {
    const patients = await patientService.getAll(requireAuthUser(req));
    res.json({ success: true, data: patients });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const patient = await patientService.getById(requireAuthUser(req), req.params.id);
    res.json({ success: true, data: patient });
  },

  async update(req: Request, res: Response): Promise<void> {
    const patient = await patientService.update(requireAuthUser(req), req.params.id, req.body);
    res.json({ success: true, data: patient });
  },

  async remove(req: Request, res: Response): Promise<void> {
    await patientService.remove(requireAuthUser(req), req.params.id);
    res.status(204).send();
  }
};

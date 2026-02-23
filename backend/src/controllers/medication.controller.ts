import { Request, Response } from 'express';
import { AppError } from '../utils/appError';
import { medicationService } from '../services/medication.service';

const getAuthUser = (req: Request): Express.AuthUser => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }
  return req.user;
};

export const medicationController = {
  async create(req: Request, res: Response): Promise<void> {
    const medication = await medicationService.create(getAuthUser(req), req.body);
    res.status(201).json({ success: true, data: medication });
  },

  async getAll(req: Request, res: Response): Promise<void> {
    const medications = await medicationService.getAll(getAuthUser(req));
    res.json({ success: true, data: medications });
  },

  async update(req: Request, res: Response): Promise<void> {
    const medication = await medicationService.update(getAuthUser(req), req.params.id, req.body);
    res.json({ success: true, data: medication });
  }
};

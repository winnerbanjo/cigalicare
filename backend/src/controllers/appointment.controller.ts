import { Request, Response } from 'express';
import { AppError } from '../utils/appError';
import { appointmentService } from '../services/appointment.service';

const requireAuthUser = (req: Request): Express.AuthUser => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }
  return req.user;
};

export const appointmentController = {
  async create(req: Request, res: Response): Promise<void> {
    const appointment = await appointmentService.create(requireAuthUser(req), req.body);
    res.status(201).json({ success: true, data: appointment });
  },

  async getAll(req: Request, res: Response): Promise<void> {
    const appointments = await appointmentService.getAll(requireAuthUser(req));
    res.json({ success: true, data: appointments });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const appointment = await appointmentService.getById(requireAuthUser(req), req.params.id);
    res.json({ success: true, data: appointment });
  },

  async update(req: Request, res: Response): Promise<void> {
    const appointment = await appointmentService.update(requireAuthUser(req), req.params.id, req.body);
    res.json({ success: true, data: appointment });
  },

  async remove(req: Request, res: Response): Promise<void> {
    await appointmentService.remove(requireAuthUser(req), req.params.id);
    res.status(204).send();
  }
};

import { Request, Response } from 'express';
import { staffService } from '../services/staff.service';
import { AppError } from '../utils/appError';

const getAuthUser = (req: Request): Express.AuthUser => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }
  return req.user;
};

export const staffController = {
  async getAll(req: Request, res: Response): Promise<void> {
    const staff = await staffService.getAll(getAuthUser(req).providerId);
    res.json({ success: true, data: staff });
  }
};

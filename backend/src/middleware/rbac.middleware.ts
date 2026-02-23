import { NextFunction, Request, Response } from 'express';
import { Role } from '../models/User';
import { AppError } from '../utils/appError';

export const allowRoles = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Forbidden', 403));
    }

    next();
  };
};

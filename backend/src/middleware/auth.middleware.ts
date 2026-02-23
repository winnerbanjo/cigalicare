import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../utils/jwt';
import { AppError } from '../utils/appError';
import { UserModel } from '../models/User';
import { isDbConnected } from '../config/db';

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized', 401));
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyJwt(token);

    if (!isDbConnected()) {
      req.user = {
        id: decoded.sub,
        providerId: decoded.providerId,
        role: decoded.role as 'doctor' | 'pharmacy' | 'admin'
      };
      return next();
    }

    const user = await UserModel.findById(decoded.sub).select('_id providerId role isActive').lean();
    if (!user || !user.isActive) {
      return next(new AppError('Unauthorized', 401));
    }

    req.user = {
      id: user._id.toString(),
      providerId: user.providerId.toString(),
      role: user.role
    };

    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
};

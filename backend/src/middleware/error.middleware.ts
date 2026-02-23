import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError';
import { env } from '../config/env';

export const notFoundMiddleware = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError('Route not found', 404));
};

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    ...(env.nodeEnv === 'development' ? { stack: err.stack } : {})
  });
};

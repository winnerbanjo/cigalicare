import { AppError } from './appError';
import { Role } from '../models/User';
import { AppointmentStatus } from '../models/Appointment';

export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const assertRequiredString = (value: unknown, fieldName: string): string => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new AppError(`${fieldName} is required`, 400);
  }
  return value.trim();
};

export const assertOptionalString = (value: unknown, fieldName: string): string | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (typeof value !== 'string') {
    throw new AppError(`${fieldName} must be a string`, 400);
  }
  return value.trim();
};

export const parseRole = (value: unknown): Role => {
  if (value !== 'doctor' && value !== 'pharmacy' && value !== 'admin') {
    throw new AppError('Invalid role', 400);
  }
  return value;
};

export const parseDate = (value: unknown, fieldName: string): Date => {
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    throw new AppError(`${fieldName} must be a valid date`, 400);
  }
  return date;
};

export const parseAppointmentStatus = (value: unknown): AppointmentStatus => {
  if (value !== 'scheduled' && value !== 'completed' && value !== 'cancelled') {
    throw new AppError('Invalid appointment status', 400);
  }
  return value;
};

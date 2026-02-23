import bcrypt from 'bcryptjs';
import { env } from '../config/env';

export const hashPassword = async (plainPassword: string): Promise<string> =>
  bcrypt.hash(plainPassword, env.bcryptSaltRounds);

export const comparePassword = async (plainPassword: string, hash: string): Promise<boolean> =>
  bcrypt.compare(plainPassword, hash);

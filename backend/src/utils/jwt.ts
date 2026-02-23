import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

interface JwtPayload {
  sub: string;
  providerId: string;
  role: string;
}

export const signJwt = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn']
  };

  return jwt.sign(payload, env.jwtSecret, options);
};

export const verifyJwt = (token: string): JwtPayload =>
  jwt.verify(token, env.jwtSecret) as JwtPayload;

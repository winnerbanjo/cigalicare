import { Role } from '../models/User';

declare global {
  namespace Express {
    interface AuthUser {
      id: string;
      providerId: string;
      role: Role;
    }

    interface Request {
      user?: AuthUser;
    }
  }
}

export {};

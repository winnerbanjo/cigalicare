import { ProviderModel, SubscriptionPlan } from '../models/Provider';
import { UserModel } from '../models/User';
import { AppError } from '../utils/appError';
import { comparePassword, hashPassword } from '../utils/password';
import { signJwt } from '../utils/jwt';
import { assertOptionalString, assertRequiredString, parseRole, validateEmail } from '../utils/validators';
import { isDbConnected } from '../config/db';

interface RegisterInput {
  providerName?: unknown;
  providerEmail?: unknown;
  providerPhone?: unknown;
  subscriptionPlan?: unknown;
  name: unknown;
  email: unknown;
  password: unknown;
  role: unknown;
}

interface LoginInput {
  email: unknown;
  password: unknown;
}

const OFFLINE_PROVIDER = {
  id: 'offline-demo-provider',
  name: 'CIGALI Demo Clinic',
  email: 'demo-provider@cigali.com',
  phone: '+1 555 110 2026',
  subscriptionPlan: 'growth' as SubscriptionPlan
};

const OFFLINE_DEMO_USERS = {
  'demo@cigali.com': {
    id: 'offline-demo-doctor',
    name: 'Demo Doctor',
    role: 'doctor' as const
  },
  'admin@cigali.com': {
    id: 'offline-demo-admin',
    name: 'Demo Admin',
    role: 'admin' as const
  }
};

const parseSubscriptionPlan = (value: unknown): SubscriptionPlan => {
  if (!value) {
    return 'starter';
  }

  if (value === 'starter' || value === 'growth' || value === 'enterprise') {
    return value;
  }

  throw new AppError('Invalid subscriptionPlan', 400);
};

const loginOfflineDemo = async (email: string, password: string) => {
  const demo = OFFLINE_DEMO_USERS[email as keyof typeof OFFLINE_DEMO_USERS];
  if (!demo || password !== 'password123') {
    throw new AppError('Invalid credentials', 401);
  }

  const token = signJwt({ sub: demo.id, providerId: OFFLINE_PROVIDER.id, role: demo.role });

  return {
    token,
    user: {
      id: demo.id,
      providerId: OFFLINE_PROVIDER.id,
      name: demo.name,
      email,
      role: demo.role,
      createdAt: new Date().toISOString()
    },
    provider: OFFLINE_PROVIDER
  };
};

export const authService = {
  async register(input: RegisterInput) {
    if (!isDbConnected()) {
      throw new AppError('Database unavailable. Registration is temporarily disabled.', 503);
    }

    const name = assertRequiredString(input.name, 'name');
    const email = assertRequiredString(input.email, 'email').toLowerCase();
    const password = assertRequiredString(input.password, 'password');
    const role = parseRole(input.role);

    const providerName = assertOptionalString(input.providerName, 'providerName') ?? `${name}'s Practice`;
    const providerEmail = (assertOptionalString(input.providerEmail, 'providerEmail') ?? email).toLowerCase();
    const providerPhone = assertOptionalString(input.providerPhone, 'providerPhone');
    const subscriptionPlan = parseSubscriptionPlan(input.subscriptionPlan);

    if (!validateEmail(email)) {
      throw new AppError('Invalid email address', 400);
    }

    if (!validateEmail(providerEmail)) {
      throw new AppError('Invalid provider email address', 400);
    }

    if (password.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400);
    }

    const existingUser = await UserModel.findOne({ email }).lean();
    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    const existingProvider = await ProviderModel.findOne({ email: providerEmail }).lean();
    if (existingProvider) {
      throw new AppError('Provider email already in use', 409);
    }

    const provider = await ProviderModel.create({
      name: providerName,
      email: providerEmail,
      phone: providerPhone,
      subscriptionPlan
    });

    const hashedPassword = await hashPassword(password);
    const user = await UserModel.create({
      providerId: provider._id,
      name,
      email,
      password: hashedPassword,
      role
    });

    const token = signJwt({ sub: user.id, providerId: provider.id, role: user.role });

    return {
      token,
      user: {
        id: user.id,
        providerId: provider.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      provider: {
        id: provider.id,
        name: provider.name,
        email: provider.email,
        phone: provider.phone,
        subscriptionPlan: provider.subscriptionPlan
      }
    };
  },

  async login(input: LoginInput) {
    const email = assertRequiredString(input.email, 'email').toLowerCase();
    const password = assertRequiredString(input.password, 'password');

    if (!validateEmail(email)) {
      throw new AppError('Invalid email address', 400);
    }

    if (!isDbConnected()) {
      return loginOfflineDemo(email, password);
    }

    const user = await UserModel.findOne({ email }).select('+password');
    if (!user || !user.isActive) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const provider = await ProviderModel.findById(user.providerId).lean();
    if (!provider) {
      throw new AppError('Provider not found', 404);
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signJwt({ sub: user.id, providerId: provider.id, role: user.role });

    return {
      token,
      user: {
        id: user.id,
        providerId: provider.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      provider: {
        id: provider.id,
        name: provider.name,
        email: provider.email,
        phone: provider.phone,
        subscriptionPlan: provider.subscriptionPlan
      }
    };
  }
};

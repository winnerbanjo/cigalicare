import { ProviderModel } from '../models/Provider';
import { AppError } from '../utils/appError';
import { assertOptionalString } from '../utils/validators';

interface UpdateProviderInput {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subscriptionPlan?: unknown;
  logoUrl?: unknown;
}

export const providerService = {
  async getPublicProfile(providerId: string) {
    const provider = await ProviderModel.findById(providerId)
      .select('_id name email phone subscriptionPlan createdAt logoUrl')
      .lean();

    if (!provider) {
      throw new AppError('Provider not found', 404);
    }

    return {
      id: provider._id.toString(),
      name: provider.name,
      email: provider.email,
      phone: provider.phone,
      logoUrl: provider.logoUrl,
      subscriptionPlan: provider.subscriptionPlan,
      createdAt: provider.createdAt
    };
  },

  async getMyProvider(providerId: string) {
    const provider = await ProviderModel.findById(providerId)
      .select('_id name email phone subscriptionPlan logoUrl createdAt updatedAt')
      .lean();

    if (!provider) {
      throw new AppError('Provider not found', 404);
    }

    return provider;
  },

  async updateMyProvider(providerId: string, input: UpdateProviderInput) {
    const updatePayload: Record<string, unknown> = {};

    if (input.name !== undefined) {
      const name = assertOptionalString(input.name, 'name');
      if (!name) {
        throw new AppError('name is required', 400);
      }
      updatePayload.name = name;
    }

    if (input.email !== undefined) {
      const email = assertOptionalString(input.email, 'email');
      if (!email) {
        throw new AppError('email is required', 400);
      }
      updatePayload.email = email.toLowerCase();
    }

    if (input.phone !== undefined) {
      updatePayload.phone = assertOptionalString(input.phone, 'phone');
    }

    if (input.subscriptionPlan !== undefined) {
      if (
        input.subscriptionPlan !== 'starter' &&
        input.subscriptionPlan !== 'growth' &&
        input.subscriptionPlan !== 'enterprise'
      ) {
        throw new AppError('Invalid subscriptionPlan', 400);
      }
      updatePayload.subscriptionPlan = input.subscriptionPlan;
    }

    if (input.logoUrl !== undefined) {
      updatePayload.logoUrl = assertOptionalString(input.logoUrl, 'logoUrl');
    }

    const provider = await ProviderModel.findByIdAndUpdate(providerId, updatePayload, {
      new: true,
      runValidators: true
    }).lean();

    if (!provider) {
      throw new AppError('Provider not found', 404);
    }

    return provider;
  }
};

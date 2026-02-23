import { StaffModel } from '../models/Staff';

export const staffService = {
  async getAll(providerId: string) {
    return StaffModel.find({ providerId }).sort({ role: 1, fullName: 1 }).lean();
  }
};

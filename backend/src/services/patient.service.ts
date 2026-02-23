import { FilterQuery } from 'mongoose';
import { IPatient, PatientModel } from '../models/Patient';
import { AppError } from '../utils/appError';
import { assertOptionalString, assertRequiredString, parseDate, validateEmail } from '../utils/validators';

interface CreatePatientInput {
  firstName: unknown;
  lastName: unknown;
  photoUrl?: unknown;
  phone?: unknown;
  email?: unknown;
  dateOfBirth?: unknown;
  gender?: unknown;
  bloodGroup?: unknown;
  allergies?: unknown;
  chronicConditions?: unknown;
  insuranceProvider?: unknown;
  emergencyContact?: unknown;
  notes?: unknown;
}

interface UpdatePatientInput extends Partial<CreatePatientInput> {}

const buildOwnershipFilter = (authUser: Express.AuthUser): FilterQuery<IPatient> => ({ providerId: authUser.providerId });

const parseStringArray = (value: unknown, fieldName: string): string[] | undefined => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw new AppError(`${fieldName} must be an array`, 400);
  return value.map((item) => String(item).trim()).filter(Boolean);
};

export const patientService = {
  async create(authUser: Express.AuthUser, input: CreatePatientInput) {
    const firstName = assertRequiredString(input.firstName, 'firstName');
    const lastName = assertRequiredString(input.lastName, 'lastName');
    const photoUrl = assertOptionalString(input.photoUrl, 'photoUrl');
    const phone = assertOptionalString(input.phone, 'phone');
    const email = assertOptionalString(input.email, 'email')?.toLowerCase();
    const notes = assertOptionalString(input.notes, 'notes');
    const insuranceProvider = assertOptionalString(input.insuranceProvider, 'insuranceProvider');
    const bloodGroup = assertOptionalString(input.bloodGroup, 'bloodGroup');
    const gender = assertOptionalString(input.gender, 'gender') as 'male' | 'female' | 'non_binary' | undefined;
    const dateOfBirth = input.dateOfBirth ? parseDate(input.dateOfBirth, 'dateOfBirth') : undefined;

    if (email && !validateEmail(email)) {
      throw new AppError('Invalid email address', 400);
    }

    const allergies = parseStringArray(input.allergies, 'allergies');
    const chronicConditions = parseStringArray(input.chronicConditions, 'chronicConditions');

    const emergencyContact =
      input.emergencyContact && typeof input.emergencyContact === 'object'
        ? {
            name: assertOptionalString((input.emergencyContact as Record<string, unknown>).name, 'emergencyContact.name'),
            relationship: assertOptionalString((input.emergencyContact as Record<string, unknown>).relationship, 'emergencyContact.relationship'),
            phone: assertOptionalString((input.emergencyContact as Record<string, unknown>).phone, 'emergencyContact.phone')
          }
        : undefined;

    return PatientModel.create({
      providerId: authUser.providerId,
      firstName,
      lastName,
      photoUrl,
      phone,
      email,
      dateOfBirth,
      gender,
      bloodGroup,
      allergies,
      chronicConditions,
      insuranceProvider,
      emergencyContact,
      notes
    });
  },

  async getAll(authUser: Express.AuthUser) {
    return PatientModel.find(buildOwnershipFilter(authUser)).sort({ createdAt: -1 }).lean();
  },

  async getById(authUser: Express.AuthUser, patientId: string) {
    const patient = await PatientModel.findOne({ _id: patientId, ...buildOwnershipFilter(authUser) }).lean();
    if (!patient) throw new AppError('Patient not found', 404);
    return patient;
  },

  async update(authUser: Express.AuthUser, patientId: string, input: UpdatePatientInput) {
    const updatePayload: Record<string, unknown> = {};

    if (input.firstName !== undefined) updatePayload.firstName = assertRequiredString(input.firstName, 'firstName');
    if (input.lastName !== undefined) updatePayload.lastName = assertRequiredString(input.lastName, 'lastName');
    if (input.photoUrl !== undefined) updatePayload.photoUrl = assertOptionalString(input.photoUrl, 'photoUrl');
    if (input.phone !== undefined) updatePayload.phone = assertOptionalString(input.phone, 'phone');
    if (input.notes !== undefined) updatePayload.notes = assertOptionalString(input.notes, 'notes');
    if (input.insuranceProvider !== undefined) updatePayload.insuranceProvider = assertOptionalString(input.insuranceProvider, 'insuranceProvider');
    if (input.bloodGroup !== undefined) updatePayload.bloodGroup = assertOptionalString(input.bloodGroup, 'bloodGroup');
    if (input.gender !== undefined) updatePayload.gender = assertOptionalString(input.gender, 'gender');

    if (input.email !== undefined) {
      const email = assertOptionalString(input.email, 'email')?.toLowerCase();
      if (email && !validateEmail(email)) throw new AppError('Invalid email address', 400);
      updatePayload.email = email;
    }

    if (input.dateOfBirth !== undefined) {
      updatePayload.dateOfBirth = input.dateOfBirth ? parseDate(input.dateOfBirth, 'dateOfBirth') : undefined;
    }

    if (input.allergies !== undefined) updatePayload.allergies = parseStringArray(input.allergies, 'allergies');
    if (input.chronicConditions !== undefined) updatePayload.chronicConditions = parseStringArray(input.chronicConditions, 'chronicConditions');

    if (input.emergencyContact !== undefined) {
      const source = input.emergencyContact as Record<string, unknown>;
      updatePayload.emergencyContact = {
        name: assertOptionalString(source?.name, 'emergencyContact.name'),
        relationship: assertOptionalString(source?.relationship, 'emergencyContact.relationship'),
        phone: assertOptionalString(source?.phone, 'emergencyContact.phone')
      };
    }

    const patient = await PatientModel.findOneAndUpdate(
      { _id: patientId, ...buildOwnershipFilter(authUser) },
      updatePayload,
      { new: true, runValidators: true }
    ).lean();

    if (!patient) throw new AppError('Patient not found', 404);
    return patient;
  },

  async remove(authUser: Express.AuthUser, patientId: string) {
    const patient = await PatientModel.findOneAndDelete({ _id: patientId, ...buildOwnershipFilter(authUser) }).lean();
    if (!patient) throw new AppError('Patient not found', 404);
  }
};

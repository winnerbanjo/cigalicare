import mongoose, { FilterQuery } from 'mongoose';
import { AppointmentModel, IAppointment } from '../models/Appointment';
import { PatientModel } from '../models/Patient';
import { AppError } from '../utils/appError';
import { assertOptionalString, assertRequiredString, parseAppointmentStatus, parseDate } from '../utils/validators';

interface CreateAppointmentInput {
  patientId: unknown;
  date: unknown;
  reason: unknown;
  type?: unknown;
  doctorAssigned?: unknown;
  status?: unknown;
}

interface UpdateAppointmentInput extends Partial<CreateAppointmentInput> {}

const buildOwnershipFilter = (authUser: Express.AuthUser): FilterQuery<IAppointment> => ({ providerId: authUser.providerId });

const ensurePatientOwnership = async (providerId: string, patientId: string): Promise<void> => {
  const patient = await PatientModel.findById(patientId).select('_id providerId').lean();
  if (!patient) throw new AppError('Patient not found', 404);
  if (patient.providerId.toString() !== providerId) throw new AppError('Forbidden: patient does not belong to your provider', 403);
};

const parseAppointmentType = (value: unknown): 'consultation' | 'follow_up' | 'surgery' | 'lab_test' => {
  if (value !== 'consultation' && value !== 'follow_up' && value !== 'surgery' && value !== 'lab_test') {
    throw new AppError('Invalid appointment type', 400);
  }
  return value;
};

export const appointmentService = {
  async create(authUser: Express.AuthUser, input: CreateAppointmentInput) {
    const patientId = assertRequiredString(input.patientId, 'patientId');
    const reason = assertRequiredString(input.reason, 'reason');
    const date = parseDate(input.date, 'date');

    if (!mongoose.Types.ObjectId.isValid(patientId)) throw new AppError('Invalid patientId', 400);
    await ensurePatientOwnership(authUser.providerId, patientId);

    const status = input.status ? parseAppointmentStatus(input.status) : 'scheduled';
    const type = input.type ? parseAppointmentType(input.type) : 'consultation';
    const doctorAssigned = assertOptionalString(input.doctorAssigned, 'doctorAssigned');

    return AppointmentModel.create({ providerId: authUser.providerId, patientId, date, reason, type, doctorAssigned, status });
  },

  async getAll(authUser: Express.AuthUser) {
    return AppointmentModel.find(buildOwnershipFilter(authUser))
      .populate('patientId', 'firstName lastName email phone photoUrl')
      .sort({ date: 1 })
      .lean();
  },

  async getById(authUser: Express.AuthUser, appointmentId: string) {
    const appointment = await AppointmentModel.findOne({ _id: appointmentId, ...buildOwnershipFilter(authUser) })
      .populate('patientId', 'firstName lastName email phone photoUrl')
      .lean();

    if (!appointment) throw new AppError('Appointment not found', 404);
    return appointment;
  },

  async update(authUser: Express.AuthUser, appointmentId: string, input: UpdateAppointmentInput) {
    const existing = await AppointmentModel.findOne({ _id: appointmentId, ...buildOwnershipFilter(authUser) });
    if (!existing) throw new AppError('Appointment not found', 404);

    if (input.patientId !== undefined) {
      const patientId = assertRequiredString(input.patientId, 'patientId');
      if (!mongoose.Types.ObjectId.isValid(patientId)) throw new AppError('Invalid patientId', 400);
      await ensurePatientOwnership(authUser.providerId, patientId);
      existing.patientId = new mongoose.Types.ObjectId(patientId);
    }

    if (input.date !== undefined) existing.date = parseDate(input.date, 'date');
    if (input.reason !== undefined) existing.reason = assertRequiredString(input.reason, 'reason');
    if (input.status !== undefined) existing.status = parseAppointmentStatus(input.status);
    if (input.type !== undefined) existing.type = parseAppointmentType(input.type);
    if (input.doctorAssigned !== undefined) existing.doctorAssigned = assertOptionalString(input.doctorAssigned, 'doctorAssigned');

    await existing.save();

    return AppointmentModel.findById(existing.id)
      .populate('patientId', 'firstName lastName email phone photoUrl')
      .lean();
  },

  async remove(authUser: Express.AuthUser, appointmentId: string) {
    const appointment = await AppointmentModel.findOneAndDelete({ _id: appointmentId, ...buildOwnershipFilter(authUser) }).lean();
    if (!appointment) throw new AppError('Appointment not found', 404);
  }
};

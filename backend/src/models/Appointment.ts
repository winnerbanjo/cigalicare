import { Document, Model, Schema, Types, model } from 'mongoose';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';
export type AppointmentType = 'consultation' | 'follow_up' | 'surgery' | 'lab_test';

export interface IAppointment extends Document {
  providerId: Types.ObjectId;
  patientId: Types.ObjectId;
  date: Date;
  reason: string;
  type: AppointmentType;
  doctorAssigned?: string;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
      index: true
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    type: {
      type: String,
      enum: ['consultation', 'follow_up', 'surgery', 'lab_test'],
      default: 'consultation',
      required: true,
      index: true
    },
    doctorAssigned: {
      type: String,
      trim: true,
      maxlength: 120
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

appointmentSchema.index({ providerId: 1, date: 1 });
appointmentSchema.index({ providerId: 1, status: 1, date: 1 });
appointmentSchema.index({ providerId: 1, type: 1, date: -1 });
appointmentSchema.index({ patientId: 1, date: -1 });
appointmentSchema.index({ providerId: 1, patientId: 1, date: -1 });

export const AppointmentModel: Model<IAppointment> = model<IAppointment>('Appointment', appointmentSchema);

import { Document, Model, Schema, Types, model } from 'mongoose';

interface IEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface IPatient extends Document {
  providerId: Types.ObjectId;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'non_binary';
  bloodGroup?: string;
  allergies: string[];
  chronicConditions: string[];
  insuranceProvider?: string;
  emergencyContact?: IEmergencyContact;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
      index: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    photoUrl: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 190
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'non_binary']
    },
    bloodGroup: {
      type: String,
      trim: true,
      maxlength: 4
    },
    allergies: {
      type: [String],
      default: []
    },
    chronicConditions: {
      type: [String],
      default: []
    },
    insuranceProvider: {
      type: String,
      trim: true,
      maxlength: 120
    },
    emergencyContact: {
      name: { type: String, trim: true },
      relationship: { type: String, trim: true },
      phone: { type: String, trim: true }
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 5000
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

patientSchema.index({ providerId: 1, createdAt: -1 });
patientSchema.index({ providerId: 1, lastName: 1, firstName: 1, _id: 1 });
patientSchema.index({ providerId: 1, email: 1 }, { partialFilterExpression: { email: { $exists: true, $ne: '' } } });
patientSchema.index({ providerId: 1, phone: 1 }, { partialFilterExpression: { phone: { $exists: true, $ne: '' } } });
patientSchema.index({ firstName: 'text', lastName: 'text', email: 'text', phone: 'text', insuranceProvider: 'text' });

export const PatientModel: Model<IPatient> = model<IPatient>('Patient', patientSchema);

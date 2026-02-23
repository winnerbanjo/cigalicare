import { Document, Model, Schema, Types, model } from 'mongoose';

export type StaffRole = 'doctor' | 'nurse' | 'admin' | 'pharmacist';

export interface IStaff extends Document {
  providerId: Types.ObjectId;
  fullName: string;
  email: string;
  role: StaffRole;
  permissions: string[];
  activityScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const staffSchema = new Schema<IStaff>(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
      index: true
    },
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 190 },
    role: { type: String, enum: ['doctor', 'nurse', 'admin', 'pharmacist'], required: true },
    permissions: { type: [String], default: [] },
    activityScore: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true, versionKey: false }
);

staffSchema.index({ providerId: 1, role: 1, fullName: 1 });
staffSchema.index({ providerId: 1, email: 1 }, { unique: true });

export const StaffModel: Model<IStaff> = model<IStaff>('Staff', staffSchema);

import { Document, Model, Schema, Types, model } from 'mongoose';

export type Role = 'doctor' | 'pharmacy' | 'admin';

export interface IUser extends Document {
  providerId: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 190
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ['doctor', 'pharmacy', 'admin'],
      required: true,
      default: 'doctor'
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    lastLoginAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ providerId: 1, role: 1, isActive: 1, createdAt: -1 });

export const UserModel: Model<IUser> = model<IUser>('User', userSchema);

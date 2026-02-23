import { Document, Model, Schema, model } from 'mongoose';

export type SubscriptionPlan = 'starter' | 'growth' | 'enterprise';

export interface IProvider extends Document {
  name: string;
  email: string;
  phone?: string;
  subscriptionPlan: SubscriptionPlan;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const providerSchema = new Schema<IProvider>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 190
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30
    },
    subscriptionPlan: {
      type: String,
      enum: ['starter', 'growth', 'enterprise'],
      default: 'starter',
      required: true
    },
    logoUrl: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

providerSchema.index({ email: 1 }, { unique: true });
providerSchema.index({ subscriptionPlan: 1, createdAt: -1 });

export const ProviderModel: Model<IProvider> = model<IProvider>('Provider', providerSchema);

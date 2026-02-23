import { Document, Model, Schema, Types, model } from 'mongoose';

export interface IMedication extends Document {
  providerId: Types.ObjectId;
  name: string;
  category?: string;
  supplier?: string;
  stock: number;
  price: number;
  costPrice?: number;
  sellingPrice?: number;
  expiryDate?: Date;
  sku?: string;
  unit?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const medicationSchema = new Schema<IMedication>(
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
      maxlength: 150
    },
    category: {
      type: String,
      trim: true,
      maxlength: 80
    },
    supplier: {
      type: String,
      trim: true,
      maxlength: 120
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    costPrice: {
      type: Number,
      min: 0,
      default: 0
    },
    sellingPrice: {
      type: Number,
      min: 0,
      default: 0
    },
    expiryDate: {
      type: Date
    },
    sku: {
      type: String,
      trim: true,
      maxlength: 80
    },
    unit: {
      type: String,
      trim: true,
      maxlength: 30
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

medicationSchema.index({ providerId: 1, name: 1 });
medicationSchema.index({ providerId: 1, category: 1, stock: 1 });
medicationSchema.index({ providerId: 1, expiryDate: 1 }, { partialFilterExpression: { expiryDate: { $exists: true } } });
medicationSchema.index({ providerId: 1, sku: 1 }, { unique: true, partialFilterExpression: { sku: { $exists: true, $ne: '' } } });
medicationSchema.index({ providerId: 1, isActive: 1, updatedAt: -1 });
medicationSchema.index({ providerId: 1, price: 1 });
medicationSchema.index({ name: 'text', description: 'text', category: 'text', supplier: 'text' });

export const MedicationModel: Model<IMedication> = model<IMedication>('Medication', medicationSchema);

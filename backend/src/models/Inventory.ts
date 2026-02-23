import { Document, Model, Schema, Types, model } from 'mongoose';

export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface IInventory extends Document {
  providerId: Types.ObjectId;
  medicationId: Types.ObjectId;
  quantityOnHand: number;
  reservedQuantity: number;
  reorderLevel: number;
  reorderQuantity: number;
  location?: string;
  batchNumber?: string;
  expiryDate?: Date;
  lastRestockedAt?: Date;
  status: InventoryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
      index: true
    },
    medicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Medication',
      required: true,
      index: true
    },
    quantityOnHand: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    reservedQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    reorderLevel: {
      type: Number,
      required: true,
      min: 0,
      default: 10
    },
    reorderQuantity: {
      type: Number,
      required: true,
      min: 1,
      default: 50
    },
    location: {
      type: String,
      trim: true,
      maxlength: 120
    },
    batchNumber: {
      type: String,
      trim: true,
      maxlength: 80
    },
    expiryDate: {
      type: Date
    },
    lastRestockedAt: {
      type: Date
    },
    status: {
      type: String,
      enum: ['in_stock', 'low_stock', 'out_of_stock'],
      default: 'in_stock',
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

inventorySchema.index({ providerId: 1, medicationId: 1 }, { unique: true });
inventorySchema.index({ providerId: 1, status: 1, updatedAt: -1 });
inventorySchema.index({ providerId: 1, expiryDate: 1 }, { partialFilterExpression: { expiryDate: { $exists: true } } });
inventorySchema.index({ providerId: 1, quantityOnHand: 1, reorderLevel: 1 });
inventorySchema.index({ medicationId: 1, expiryDate: 1 });

export const InventoryModel: Model<IInventory> = model<IInventory>('Inventory', inventorySchema);

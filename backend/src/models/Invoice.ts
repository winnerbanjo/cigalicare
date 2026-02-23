import { Document, Model, Schema, Types, model } from 'mongoose';

export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface IInvoice extends Document {
  providerId: Types.ObjectId;
  patientId: Types.ObjectId;
  invoiceNumber: string;
  amount: number;
  paidAmount: number;
  status: InvoiceStatus;
  dueDate: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: 'Provider', required: true, index: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    invoiceNumber: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, required: true, min: 0, default: 0 },
    status: { type: String, enum: ['paid', 'pending', 'overdue'], required: true, default: 'pending', index: true },
    dueDate: { type: Date, required: true },
    paidAt: { type: Date }
  },
  { timestamps: true, versionKey: false }
);

invoiceSchema.index({ providerId: 1, status: 1, dueDate: 1 });
invoiceSchema.index({ providerId: 1, invoiceNumber: 1 }, { unique: true });

export const InvoiceModel: Model<IInvoice> = model<IInvoice>('Invoice', invoiceSchema);

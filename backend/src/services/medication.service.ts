import { FilterQuery } from 'mongoose';
import { IMedication, MedicationModel } from '../models/Medication';
import { AppError } from '../utils/appError';
import { assertOptionalString, assertRequiredString, parseDate } from '../utils/validators';

interface CreateMedicationInput {
  name: unknown;
  category?: unknown;
  supplier?: unknown;
  stock?: unknown;
  price?: unknown;
  costPrice?: unknown;
  sellingPrice?: unknown;
  expiryDate?: unknown;
  sku?: unknown;
  unit?: unknown;
  description?: unknown;
}

interface UpdateMedicationInput extends Partial<CreateMedicationInput> {}

const ownershipFilter = (authUser: Express.AuthUser): FilterQuery<IMedication> => ({ providerId: authUser.providerId });

const parseNonNegativeNumber = (value: unknown, field: string): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) throw new AppError(`${field} must be a non-negative number`, 400);
  return parsed;
};

export const medicationService = {
  async create(authUser: Express.AuthUser, input: CreateMedicationInput) {
    const name = assertRequiredString(input.name, 'name');
    const category = assertOptionalString(input.category, 'category');
    const supplier = assertOptionalString(input.supplier, 'supplier');
    const stock = input.stock === undefined ? 0 : parseNonNegativeNumber(input.stock, 'stock');
    const price = input.price === undefined ? 0 : parseNonNegativeNumber(input.price, 'price');
    const costPrice = input.costPrice === undefined ? 0 : parseNonNegativeNumber(input.costPrice, 'costPrice');
    const sellingPrice = input.sellingPrice === undefined ? price : parseNonNegativeNumber(input.sellingPrice, 'sellingPrice');
    const expiryDate = input.expiryDate ? parseDate(input.expiryDate, 'expiryDate') : undefined;
    const sku = assertOptionalString(input.sku, 'sku');
    const unit = assertOptionalString(input.unit, 'unit');
    const description = assertOptionalString(input.description, 'description');

    return MedicationModel.create({
      providerId: authUser.providerId,
      name,
      category,
      supplier,
      stock,
      price,
      costPrice,
      sellingPrice,
      expiryDate,
      sku,
      unit,
      description
    });
  },

  async getAll(authUser: Express.AuthUser) {
    return MedicationModel.find(ownershipFilter(authUser)).sort({ createdAt: -1 }).lean();
  },

  async update(authUser: Express.AuthUser, medicationId: string, input: UpdateMedicationInput) {
    const updatePayload: Record<string, unknown> = {};

    if (input.name !== undefined) updatePayload.name = assertRequiredString(input.name, 'name');
    if (input.category !== undefined) updatePayload.category = assertOptionalString(input.category, 'category');
    if (input.supplier !== undefined) updatePayload.supplier = assertOptionalString(input.supplier, 'supplier');
    if (input.stock !== undefined) updatePayload.stock = parseNonNegativeNumber(input.stock, 'stock');
    if (input.price !== undefined) updatePayload.price = parseNonNegativeNumber(input.price, 'price');
    if (input.costPrice !== undefined) updatePayload.costPrice = parseNonNegativeNumber(input.costPrice, 'costPrice');
    if (input.sellingPrice !== undefined) updatePayload.sellingPrice = parseNonNegativeNumber(input.sellingPrice, 'sellingPrice');
    if (input.expiryDate !== undefined) updatePayload.expiryDate = input.expiryDate ? parseDate(input.expiryDate, 'expiryDate') : undefined;
    if (input.sku !== undefined) updatePayload.sku = assertOptionalString(input.sku, 'sku');
    if (input.unit !== undefined) updatePayload.unit = assertOptionalString(input.unit, 'unit');
    if (input.description !== undefined) updatePayload.description = assertOptionalString(input.description, 'description');

    const medication = await MedicationModel.findOneAndUpdate(
      { _id: medicationId, ...ownershipFilter(authUser) },
      updatePayload,
      { new: true, runValidators: true }
    ).lean();

    if (!medication) throw new AppError('Medication not found', 404);
    return medication;
  }
};

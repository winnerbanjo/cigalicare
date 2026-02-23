export interface Medication {
  _id: string;
  providerId: string;
  name: string;
  category?: string;
  supplier?: string;
  stock: number;
  price: number;
  costPrice?: number;
  sellingPrice?: number;
  expiryDate?: string;
  sku?: string;
  unit?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationInput {
  name: string;
  category?: string;
  supplier?: string;
  stock?: number;
  price?: number;
  costPrice?: number;
  sellingPrice?: number;
  expiryDate?: string;
  sku?: string;
  unit?: string;
  description?: string;
}

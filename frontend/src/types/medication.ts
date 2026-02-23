export interface Medication {
  _id: string;
  providerId: string;
  name: string;
  stock: number;
  price: number;
  sku?: string;
  unit?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationInput {
  name: string;
  stock?: number;
  price?: number;
  sku?: string;
  unit?: string;
  description?: string;
}

export interface EmergencyContact {
  name?: string;
  relationship?: string;
  phone?: string;
}

export interface Patient {
  _id: string;
  providerId: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'non_binary';
  bloodGroup?: string;
  allergies?: string[];
  chronicConditions?: string[];
  insuranceProvider?: string;
  emergencyContact?: EmergencyContact;
  tier?: 'standard' | 'priority' | 'vip';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientInput {
  firstName: string;
  lastName: string;
  photoUrl?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'non_binary';
  bloodGroup?: string;
  allergies?: string[];
  chronicConditions?: string[];
  insuranceProvider?: string;
  emergencyContact?: EmergencyContact;
  tier?: 'standard' | 'priority' | 'vip';
  notes?: string;
}

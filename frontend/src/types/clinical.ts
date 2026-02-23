export type PatientTier = 'standard' | 'priority' | 'vip';

export interface LabResult {
  _id: string;
  patientId: string;
  providerId: string;
  testName: string;
  value: string;
  status: 'normal' | 'abnormal' | 'critical';
  flagged: boolean;
  createdAt: string;
}

export interface Prescription {
  _id: string;
  patientId: string;
  providerId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  doctorName: string;
  notes?: string;
  createdAt: string;
}

export interface SoapNote {
  _id: string;
  patientId: string;
  providerId: string;
  doctorName: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  privateNote?: string;
  createdAt: string;
}

export interface RiskAlert {
  id: string;
  patientId: string;
  severity: 'warning' | 'critical';
  reason: string;
}

export interface DoctorTask {
  id: string;
  label: string;
  priority: 'low' | 'medium' | 'high';
  dueAt: string;
  done: boolean;
}

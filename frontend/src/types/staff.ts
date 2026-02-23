export type StaffRole = 'doctor' | 'nurse' | 'admin' | 'pharmacist';

export interface StaffMember {
  _id: string;
  providerId: string;
  fullName: string;
  email: string;
  role: StaffRole;
  permissions: string[];
  activityScore: number;
  createdAt: string;
  updatedAt: string;
}

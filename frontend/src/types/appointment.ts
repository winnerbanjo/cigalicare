export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';
export type AppointmentType = 'consultation' | 'follow_up' | 'surgery' | 'lab_test';

export interface Appointment {
  _id: string;
  providerId: string;
  patientId:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
        email?: string;
        phone?: string;
        photoUrl?: string;
      };
  date: string;
  reason: string;
  type: AppointmentType;
  doctorAssigned?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentInput {
  patientId: string;
  date: string;
  reason: string;
  type?: AppointmentType;
  doctorAssigned?: string;
  status?: AppointmentStatus;
}

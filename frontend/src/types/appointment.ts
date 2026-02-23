export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

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
      };
  date: string;
  reason: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentInput {
  patientId: string;
  date: string;
  reason: string;
  status?: AppointmentStatus;
}

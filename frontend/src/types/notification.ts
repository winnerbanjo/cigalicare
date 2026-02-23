export interface AppNotification {
  id: string;
  type: 'appointment' | 'inventory' | 'patient';
  title: string;
  description: string;
  createdAt: string;
}

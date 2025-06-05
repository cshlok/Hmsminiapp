export interface IAppointment {
  id: string;
  patientId: string;
  serviceId: string;
  date: Date;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  reminderSent?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const AppointmentSchema = {};

import { IAppointment } from '../models/AppointmentModel';

export class AppointmentRepository {
  private appointments: IAppointment[] = [];

  async getAllAppointments(): Promise<IAppointment[]> {
    return this.appointments;
  }

  async getAppointmentById(id: string): Promise<IAppointment | null> {
    return this.appointments.find(a => a.id === id) || null;
  }

  async saveAppointment(appointment: IAppointment): Promise<IAppointment> {
    const existing = this.appointments.findIndex(a => a.id === appointment.id);
    if (existing >= 0) {
      this.appointments[existing] = appointment;
    } else {
      this.appointments.push(appointment);
    }
    return appointment;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index >= 0) {
      this.appointments.splice(index, 1);
      return true;
    }
    return false;
  }
}

export default new AppointmentRepository();

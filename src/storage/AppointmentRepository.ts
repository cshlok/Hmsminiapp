import Realm from 'realm';
import { AppointmentSchema } from '../models/AppointmentModel';
import { IAppointment } from '../models/AppointmentModel';
import { v4 as uuidv4 } from 'uuid';

// Add AppointmentSchema to database configuration
export const appointmentDatabaseOptions = {
  schema: [AppointmentSchema],
  schemaVersion: 1,
};

// Appointment repository for CRUD operations
export class AppointmentRepository {
  private realm: Realm;

  constructor(realm: Realm) {
    this.realm = realm;
  }

  // Create a new appointment
  createAppointment(appointment: IAppointment): IAppointment {
    try {
      let newAppointment: IAppointment;
      
      this.realm.write(() => {
        newAppointment = this.realm.create('Appointment', {
          id: appointment.id || uuidv4(),
          patientId: appointment.patientId,
          date: appointment.date,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          duration: appointment.duration,
          status: appointment.status,
          notes: appointment.notes || '',
          reminderSent: appointment.reminderSent || false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }) as unknown as IAppointment;
      });
      
      return newAppointment;
    } catch (error) {
      console.error('Failed to create appointment:', error);
      throw error;
    }
  }

  // Get all appointments
  getAllAppointments() {
    try {
      return this.realm.objects<IAppointment>('Appointment').sorted('date');
    } catch (error) {
      console.error('Failed to get appointments:', error);
      throw error;
    }
  }

  // Get appointment by ID
  getAppointmentById(id: string): IAppointment | null {
    try {
      return this.realm.objectForPrimaryKey<IAppointment>('Appointment', id) || null;
    } catch (error) {
      console.error('Failed to get appointment by ID:', error);
      throw error;
    }
  }

  // Get appointments by patient ID
  getAppointmentsByPatientId(patientId: string) {
    try {
      return this.realm.objects<IAppointment>('Appointment')
        .filtered('patientId == $0', patientId)
        .sorted('date');
    } catch (error) {
      console.error('Failed to get appointments by patient ID:', error);
      throw error;
    }
  }

  // Get appointments by date range
  getAppointmentsByDateRange(startDate: Date, endDate: Date) {
    try {
      return this.realm.objects<IAppointment>('Appointment')
        .filtered('date >= $0 && date <= $1', startDate, endDate)
        .sorted('date');
    } catch (error) {
      console.error('Failed to get appointments by date range:', error);
      throw error;
    }
  }

  // Get appointments by status
  getAppointmentsByStatus(status: string) {
    try {
      return this.realm.objects<IAppointment>('Appointment')
        .filtered('status == $0', status)
        .sorted('date');
    } catch (error) {
      console.error('Failed to get appointments by status:', error);
      throw error;
    }
  }

  // Update appointment
  updateAppointment(id: string, updatedData: Partial<IAppointment>): IAppointment | null {
    try {
      const appointment = this.getAppointmentById(id);
      if (appointment) {
        this.realm.write(() => {
          Object.keys(updatedData).forEach(key => {
            if (key !== 'id' && key !== 'createdAt') {
              // Type-safe property access
              const typedKey = key as keyof IAppointment;
              if (updatedData[typedKey] !== undefined) {
                (appointment as any)[key] = updatedData[typedKey];
              }
            }
          });
          appointment.updatedAt = new Date();
        });
        return appointment;
      }
      return null;
    } catch (error) {
      console.error('Failed to update appointment:', error);
      throw error;
    }
  }

  // Delete appointment
  deleteAppointment(id: string): boolean {
    try {
      const appointment = this.getAppointmentById(id);
      if (appointment) {
        this.realm.write(() => {
          this.realm.delete(appointment);
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      throw error;
    }
  }

  // Check for time slot availability
  isTimeSlotAvailable(date: Date, startTime: string, endTime: string, excludeAppointmentId?: string): boolean {
    try {
      // Convert date to start of day for comparison
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      // Convert date to end of day for comparison
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      // Get all appointments for the day
      const appointments = this.realm.objects<IAppointment>('Appointment')
        .filtered('date >= $0 && date <= $1', startOfDay, endOfDay);
      
      // Check for overlapping appointments
      for (const appointment of appointments) {
        // Skip the current appointment if we're checking for an update
        if (excludeAppointmentId && appointment.id === excludeAppointmentId) {
          continue;
        }
        
        // Check if the appointment is cancelled (cancelled appointments don't block time slots)
        if (appointment.status === 'cancelled') {
          continue;
        }
        
        // Check for time overlap
        if ((startTime >= appointment.startTime && startTime < appointment.endTime) ||
            (endTime > appointment.startTime && endTime <= appointment.endTime) ||
            (startTime <= appointment.startTime && endTime >= appointment.endTime)) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Failed to check time slot availability:', error);
      throw error;
    }
  }
}

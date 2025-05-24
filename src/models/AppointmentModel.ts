// Appointment Scheduling Module - Data Model and Schema

import { ObjectSchema } from 'realm';

// Appointment model definition for Realm Database
export interface IAppointment {
  id: string;
  patientId: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Appointment schema for Realm Database
export const AppointmentSchema: ObjectSchema = {
  name: 'Appointment',
  primaryKey: 'id',
  properties: {
    id: 'string',
    patientId: 'string',
    date: 'date',
    startTime: 'string',
    endTime: 'string',
    duration: 'int',
    status: 'string',
    notes: 'string',
    reminderSent: 'boolean',
    createdAt: 'date',
    updatedAt: 'date',
  },
};

export interface IPatient {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const PatientSchema = {};

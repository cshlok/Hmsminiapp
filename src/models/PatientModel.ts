// Patient model definition for Realm Database
export interface IPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  email: string;
  address: string;
  medicalHistory: string;
  allergies: string;
  medications: string;
  lastVisit: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Patient schema for Realm Database
export const PatientSchema = {
  name: 'Patient',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    age: 'int',
    gender: 'string',
    contact: 'string',
    email: 'string',
    address: 'string',
    medicalHistory: 'string',
    allergies: 'string',
    medications: 'string',
    lastVisit: 'date',
    createdAt: 'date',
    updatedAt: 'date',
  },
};

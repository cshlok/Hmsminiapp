import Realm from 'realm';
import { PatientSchema } from '../models/PatientModel';

// Database configuration
const databaseOptions = {
  schema: [PatientSchema],
  schemaVersion: 1,
};

// Initialize the Realm database
export const initializeRealm = async () => {
  try {
    const realm = await Realm.open(databaseOptions);
    return realm;
  } catch (error) {
    console.error('Failed to open Realm database:', error);
    throw error;
  }
};

// Patient repository for CRUD operations
export class PatientRepository {
  private realm: Realm;

  constructor(realm: Realm) {
    this.realm = realm;
  }

  // Create a new patient
  createPatient(patient: any) {
    try {
      let newPatient;
      this.realm.write(() => {
        newPatient = this.realm.create('Patient', {
          id: patient.id,
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          contact: patient.contact,
          email: patient.email,
          address: patient.address,
          medicalHistory: patient.medicalHistory,
          allergies: patient.allergies,
          medications: patient.medications,
          lastVisit: patient.lastVisit,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
      return newPatient;
    } catch (error) {
      console.error('Failed to create patient:', error);
      throw error;
    }
  }

  // Get all patients
  getAllPatients() {
    try {
      return this.realm.objects('Patient').sorted('name');
    } catch (error) {
      console.error('Failed to get patients:', error);
      throw error;
    }
  }

  // Get patient by ID
  getPatientById(id: string) {
    try {
      return this.realm.objectForPrimaryKey('Patient', id);
    } catch (error) {
      console.error('Failed to get patient by ID:', error);
      throw error;
    }
  }

  // Update patient
  updatePatient(id: string, updatedData: any) {
    try {
      const patient = this.getPatientById(id);
      if (patient) {
        this.realm.write(() => {
          Object.keys(updatedData).forEach(key => {
            if (key !== 'id' && key !== 'createdAt') {
              patient[key] = updatedData[key];
            }
          });
          patient.updatedAt = new Date();
        });
        return patient;
      }
      return null;
    } catch (error) {
      console.error('Failed to update patient:', error);
      throw error;
    }
  }

  // Delete patient
  deletePatient(id: string) {
    try {
      const patient = this.getPatientById(id);
      if (patient) {
        this.realm.write(() => {
          this.realm.delete(patient);
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete patient:', error);
      throw error;
    }
  }

  // Search patients by name
  searchPatientsByName(query: string) {
    try {
      const patients = this.realm.objects('Patient');
      return patients.filtered('name CONTAINS[c] $0', query).sorted('name');
    } catch (error) {
      console.error('Failed to search patients by name:', error);
      throw error;
    }
  }

  // Sort patients by last visit date
  sortPatientsByLastVisit(ascending = false) {
    try {
      return this.realm.objects('Patient').sorted('lastVisit', ascending);
    } catch (error) {
      console.error('Failed to sort patients by last visit:', error);
      throw error;
    }
  }
}

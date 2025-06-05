import { IPatient } from '../models/PatientModel';

export class PatientRepository {
  private patients: IPatient[] = [];

  async getAllPatients(): Promise<IPatient[]> {
    return this.patients;
  }

  async getPatientById(id: string): Promise<IPatient | null> {
    return this.patients.find(item => item.id === id) || null;
  }

  async savePatient(item: IPatient): Promise<IPatient> {
    const existing = this.patients.findIndex(i => i.id === item.id);
    if (existing >= 0) {
      this.patients[existing] = item;
    } else {
      this.patients.push(item);
    }
    return item;
  }

  async deletePatient(id: string): Promise<boolean> {
    const index = this.patients.findIndex(item => item.id === id);
    if (index >= 0) {
      this.patients.splice(index, 1);
      return true;
    }
    return false;
  }
}

export default new PatientRepository();

import { IService } from '../models/ServiceModel';

export class ServiceRepository {
  private services: IService[] = [];

  async getAllServices(): Promise<IService[]> {
    return this.services;
  }

  async getServiceById(id: string): Promise<IService | null> {
    return this.services.find(item => item.id === id) || null;
  }

  async saveService(item: IService): Promise<IService> {
    const existing = this.services.findIndex(i => i.id === item.id);
    if (existing >= 0) {
      this.services[existing] = item;
    } else {
      this.services.push(item);
    }
    return item;
  }

  async deleteService(id: string): Promise<boolean> {
    const index = this.services.findIndex(item => item.id === id);
    if (index >= 0) {
      this.services.splice(index, 1);
      return true;
    }
    return false;
  }
}

export default new ServiceRepository();

import Realm from 'realm';
import { ServiceSchema, ServiceCategorySchema } from '../models/ServiceModel';
import { IService, IServiceCategory } from '../models/ServiceModel';

// Database configuration
export const serviceDatabaseOptions = {
  schema: [ServiceSchema, ServiceCategorySchema],
  schemaVersion: 1,
};

// Service repository for CRUD operations
export class ServiceRepository {
  private realm: Realm;

  constructor(realm: Realm) {
    this.realm = realm;
  }

  // Category CRUD operations
  createCategory(category: IServiceCategory): IServiceCategory {
    try {
      let newCategory;
      this.realm.write(() => {
        newCategory = this.realm.create('ServiceCategory', {
          id: category.id,
          name: category.name,
          description: category.description || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
      return newCategory;
    } catch (error) {
      console.error('Failed to create service category:', error);
      throw error;
    }
  }

  getAllCategories() {
    try {
      return this.realm.objects<IServiceCategory>('ServiceCategory').sorted('name');
    } catch (error) {
      console.error('Failed to get service categories:', error);
      throw error;
    }
  }

  getCategoryById(id: string) {
    try {
      return this.realm.objectForPrimaryKey<IServiceCategory>('ServiceCategory', id);
    } catch (error) {
      console.error('Failed to get service category by ID:', error);
      throw error;
    }
  }

  updateCategory(id: string, updatedData: Partial<IServiceCategory>) {
    try {
      const category = this.getCategoryById(id);
      if (category) {
        this.realm.write(() => {
          Object.keys(updatedData).forEach(key => {
            if (key !== 'id' && key !== 'createdAt') {
              category[key] = updatedData[key];
            }
          });
          category.updatedAt = new Date();
        });
        return category;
      }
      return null;
    } catch (error) {
      console.error('Failed to update service category:', error);
      throw error;
    }
  }

  deleteCategory(id: string) {
    try {
      const category = this.getCategoryById(id);
      if (category) {
        // First, delete all services in this category
        const services = this.getServicesByCategoryId(id);
        this.realm.write(() => {
          this.realm.delete(services);
          this.realm.delete(category);
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete service category:', error);
      throw error;
    }
  }

  // Service CRUD operations
  createService(service: IService): IService {
    try {
      let newService;
      this.realm.write(() => {
        newService = this.realm.create('Service', {
          id: service.id,
          categoryId: service.categoryId,
          name: service.name,
          description: service.description || '',
          price: service.price,
          duration: service.duration,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
      return newService;
    } catch (error) {
      console.error('Failed to create service:', error);
      throw error;
    }
  }

  getAllServices() {
    try {
      return this.realm.objects<IService>('Service').sorted('name');
    } catch (error) {
      console.error('Failed to get services:', error);
      throw error;
    }
  }

  getServiceById(id: string) {
    try {
      return this.realm.objectForPrimaryKey<IService>('Service', id);
    } catch (error) {
      console.error('Failed to get service by ID:', error);
      throw error;
    }
  }

  getServicesByCategoryId(categoryId: string) {
    try {
      return this.realm.objects<IService>('Service')
        .filtered('categoryId == $0', categoryId)
        .sorted('name');
    } catch (error) {
      console.error('Failed to get services by category ID:', error);
      throw error;
    }
  }

  updateService(id: string, updatedData: Partial<IService>) {
    try {
      const service = this.getServiceById(id);
      if (service) {
        this.realm.write(() => {
          Object.keys(updatedData).forEach(key => {
            if (key !== 'id' && key !== 'createdAt') {
              service[key] = updatedData[key];
            }
          });
          service.updatedAt = new Date();
        });
        return service;
      }
      return null;
    } catch (error) {
      console.error('Failed to update service:', error);
      throw error;
    }
  }

  deleteService(id: string) {
    try {
      const service = this.getServiceById(id);
      if (service) {
        this.realm.write(() => {
          this.realm.delete(service);
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete service:', error);
      throw error;
    }
  }

  // Search services by name
  searchServicesByName(query: string) {
    try {
      const services = this.realm.objects<IService>('Service');
      return services.filtered('name CONTAINS[c] $0', query).sorted('name');
    } catch (error) {
      console.error('Failed to search services by name:', error);
      throw error;
    }
  }

  // Sort services by price
  sortServicesByPrice(ascending = true) {
    try {
      return this.realm.objects<IService>('Service').sorted('price', !ascending);
    } catch (error) {
      console.error('Failed to sort services by price:', error);
      throw error;
    }
  }

  // Sort services by duration
  sortServicesByDuration(ascending = true) {
    try {
      return this.realm.objects<IService>('Service').sorted('duration', !ascending);
    } catch (error) {
      console.error('Failed to sort services by duration:', error);
      throw error;
    }
  }
}

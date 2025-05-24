import Realm from 'realm';
import { ServiceSchema, ServiceCategorySchema } from '../models/ServiceModel';
import { IService, IServiceCategory } from '../models/ServiceModel';
import { v4 as uuidv4 } from 'uuid';

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
      let newCategory!: IServiceCategory; // Using definite assignment assertion
      
      this.realm.write(() => {
        newCategory = this.realm.create('ServiceCategory', {
          id: category.id || uuidv4(),
          name: category.name,
          description: category.description || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        }) as unknown as IServiceCategory;
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

  getCategoryById(id: string): IServiceCategory | null {
    try {
      return this.realm.objectForPrimaryKey<IServiceCategory>('ServiceCategory', id) || null;
    } catch (error) {
      console.error('Failed to get service category by ID:', error);
      throw error;
    }
  }

  updateCategory(id: string, updatedData: Partial<IServiceCategory>): IServiceCategory | null {
    try {
      const category = this.getCategoryById(id);
      if (category) {
        this.realm.write(() => {
          Object.keys(updatedData).forEach(key => {
            if (key !== 'id' && key !== 'createdAt') {
              // Type-safe property access
              const typedKey = key as keyof IServiceCategory;
              if (updatedData[typedKey] !== undefined) {
                (category as any)[key] = updatedData[typedKey];
              }
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

  deleteCategory(id: string): boolean {
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
      let newService!: IService; // Using definite assignment assertion
      
      this.realm.write(() => {
        newService = this.realm.create('Service', {
          id: service.id || uuidv4(),
          categoryId: service.categoryId,
          name: service.name,
          description: service.description || '',
          price: service.price,
          duration: service.duration,
          createdAt: new Date(),
          updatedAt: new Date(),
        }) as unknown as IService;
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

  getServiceById(id: string): IService | null {
    try {
      return this.realm.objectForPrimaryKey<IService>('Service', id) || null;
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

  updateService(id: string, updatedData: Partial<IService>): IService | null {
    try {
      const service = this.getServiceById(id);
      if (service) {
        this.realm.write(() => {
          Object.keys(updatedData).forEach(key => {
            if (key !== 'id' && key !== 'createdAt') {
              // Type-safe property access
              const typedKey = key as keyof IService;
              if (updatedData[typedKey] !== undefined) {
                (service as any)[key] = updatedData[typedKey];
              }
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

  deleteService(id: string): boolean {
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

import { IService, IServiceCategory } from '../models/ServiceModel';

// Update the interfaces in the slice to match the model definitions
export interface ICategory {
  id: string;
  name: string;
  description: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IServiceSlice {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  active?: boolean;
  taxable?: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Conversion functions to ensure compatibility between models and Redux state
export const convertServiceToSlice = (service: IService): IServiceSlice => {
  return {
    ...service,
    active: true,
    taxable: true,
    createdAt: service.createdAt instanceof Date ? service.createdAt.toISOString() : service.createdAt,
    updatedAt: service.updatedAt instanceof Date ? service.updatedAt.toISOString() : service.updatedAt
  };
};

export const convertSliceToService = (service: IServiceSlice): IService => {
  const { active, taxable, ...serviceData } = service;
  return {
    ...serviceData,
    createdAt: typeof service.createdAt === 'string' ? new Date(service.createdAt) : service.createdAt,
    updatedAt: typeof service.updatedAt === 'string' ? new Date(service.updatedAt) : service.updatedAt
  };
};

export const convertCategoryToSlice = (category: IServiceCategory): ICategory => {
  return {
    ...category,
    createdAt: category.createdAt instanceof Date ? category.createdAt.toISOString() : category.createdAt,
    updatedAt: category.updatedAt instanceof Date ? category.updatedAt.toISOString() : category.updatedAt
  };
};

export const convertSliceToCategory = (category: ICategory): IServiceCategory => {
  return {
    ...category,
    createdAt: typeof category.createdAt === 'string' ? new Date(category.createdAt) : category.createdAt,
    updatedAt: typeof category.updatedAt === 'string' ? new Date(category.updatedAt) : category.updatedAt
  };
};

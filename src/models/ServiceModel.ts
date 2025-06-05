export interface IServiceCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IService {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  categoryId?: string;
  duration?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const ServiceSchema = {};
export const ServiceCategorySchema = {};

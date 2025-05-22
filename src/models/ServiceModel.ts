# Service Management Module - Data Model and Schema

import { ObjectSchema } from 'realm';

// Service Category model definition for Realm Database
export interface IServiceCategory {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Service model definition for Realm Database
export interface IService {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

// Service Category schema for Realm Database
export const ServiceCategorySchema: ObjectSchema = {
  name: 'ServiceCategory',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    description: 'string',
    createdAt: 'date',
    updatedAt: 'date',
  },
};

// Service schema for Realm Database
export const ServiceSchema: ObjectSchema = {
  name: 'Service',
  primaryKey: 'id',
  properties: {
    id: 'string',
    categoryId: 'string',
    name: 'string',
    description: 'string',
    price: 'double',
    duration: 'int',
    createdAt: 'date',
    updatedAt: 'date',
  },
};

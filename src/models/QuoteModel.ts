# Quote Generator Module - Data Model and Schema

import { ObjectSchema } from 'realm';

// Quote model definition for Realm Database
export interface IQuote {
  id: string;
  patientId: string;
  date: Date;
  items: IQuoteItem[];
  subtotal: number;
  discountType: 'percentage' | 'fixed' | 'none';
  discountValue: number;
  discountAmount: number;
  taxPercentage: number;
  taxAmount: number;
  total: number;
  notes: string;
  status: 'draft' | 'final' | 'converted' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Quote Item model definition for Realm Database
export interface IQuoteItem {
  id: string;
  quoteId: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  notes: string;
}

// Quote schema for Realm Database
export const QuoteSchema: ObjectSchema = {
  name: 'Quote',
  primaryKey: 'id',
  properties: {
    id: 'string',
    patientId: 'string',
    date: 'date',
    items: 'QuoteItem[]',
    subtotal: 'double',
    discountType: 'string',
    discountValue: 'double',
    discountAmount: 'double',
    taxPercentage: 'double',
    taxAmount: 'double',
    total: 'double',
    notes: 'string',
    status: 'string',
    createdAt: 'date',
    updatedAt: 'date',
  },
};

// Quote Item schema for Realm Database
export const QuoteItemSchema: ObjectSchema = {
  name: 'QuoteItem',
  primaryKey: 'id',
  properties: {
    id: 'string',
    quoteId: 'string',
    serviceId: 'string',
    serviceName: 'string',
    quantity: 'int',
    unitPrice: 'double',
    amount: 'double',
    notes: 'string',
  },
};

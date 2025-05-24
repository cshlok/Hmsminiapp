// Billing System Module - Data Model and Schema

import { ObjectSchema } from 'realm';

// Bill model definition for Realm Database
export interface IBill {
  id: string;
  patientId: string;
  quoteId: string | null; // If converted from a quote
  date: Date;
  dueDate: Date;
  items: IBillItem[];
  subtotal: number;
  discountType: 'percentage' | 'fixed' | 'none';
  discountValue: number;
  discountAmount: number;
  taxPercentage: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  balance: number;
  notes: string;
  status: 'unpaid' | 'partially_paid' | 'paid' | 'cancelled' | 'overdue';
  payments: IPayment[];
  createdAt: Date;
  updatedAt: Date;
}

// Bill Item model definition for Realm Database
export interface IBillItem {
  id: string;
  billId: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  notes: string;
}

// Payment model definition for Realm Database
export interface IPayment {
  id: string;
  billId: string;
  date: Date;
  amount: number;
  method: 'cash' | 'card' | 'bank_transfer' | 'other';
  reference: string; // Reference number, receipt number, etc.
  notes: string;
  createdAt: Date;
}

// Bill schema for Realm Database
export const BillSchema: ObjectSchema = {
  name: 'Bill',
  primaryKey: 'id',
  properties: {
    id: 'string',
    patientId: 'string',
    quoteId: 'string?',
    date: 'date',
    dueDate: 'date',
    items: 'BillItem[]',
    subtotal: 'double',
    discountType: 'string',
    discountValue: 'double',
    discountAmount: 'double',
    taxPercentage: 'double',
    taxAmount: 'double',
    total: 'double',
    amountPaid: 'double',
    balance: 'double',
    notes: 'string',
    status: 'string',
    payments: 'Payment[]',
    createdAt: 'date',
    updatedAt: 'date',
  },
};

// Bill Item schema for Realm Database
export const BillItemSchema: ObjectSchema = {
  name: 'BillItem',
  primaryKey: 'id',
  properties: {
    id: 'string',
    billId: 'string',
    serviceId: 'string',
    serviceName: 'string',
    quantity: 'int',
    unitPrice: 'double',
    amount: 'double',
    notes: 'string',
  },
};

// Payment schema for Realm Database
export const PaymentSchema: ObjectSchema = {
  name: 'Payment',
  primaryKey: 'id',
  properties: {
    id: 'string',
    billId: 'string',
    date: 'date',
    amount: 'double',
    method: 'string',
    reference: 'string',
    notes: 'string',
    createdAt: 'date',
  },
};

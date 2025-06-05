export interface IBillItem {
  id: string;
  billId: string;
  serviceId: string;
  serviceName?: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  notes?: string;
}

export interface IPayment {
  id: string;
  billId: string;
  amount: number;
  date: Date;
  method: string;
  notes?: string;
}

export interface IBill {
  id: string;
  patientId: string;
  quoteId?: string;
  date: Date;
  dueDate: Date;
  items: IBillItem[];
  total: number;
  subtotal?: number;
  discountType?: 'percentage' | 'fixed' | 'none';
  discountValue?: number;
  discountAmount?: number;
  taxPercentage?: number;
  taxAmount?: number;
  amountPaid: number;
  balance: number;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue';
  payments?: IPayment[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const BillSchema = {};
export const BillItemSchema = {};
export const PaymentSchema = {};

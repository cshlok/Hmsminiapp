export interface IQuoteItem {
  id: string;
  quoteId: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  notes?: string;
}

export interface IQuote {
  id: string;
  patientId: string;
  date: Date;
  validUntil: Date;
  items: IQuoteItem[];
  total: number;
  status: string;
  notes?: string;
  subtotal?: number;
  discountType?: 'percentage' | 'fixed' | 'none';
  discountValue?: number;
  discountAmount?: number;
  taxPercentage?: number;
  taxAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const QuoteSchema = {};
export const QuoteItemSchema = {};

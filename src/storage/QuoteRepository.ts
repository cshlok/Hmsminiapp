import Realm from 'realm';
import { QuoteSchema, QuoteItemSchema } from '../models/QuoteModel';
import { IQuote, IQuoteItem } from '../models/QuoteModel';

// Database configuration
export const quoteDatabaseOptions = {
  schema: [QuoteSchema, QuoteItemSchema],
  schemaVersion: 1,
};

// Quote repository for CRUD operations
export class QuoteRepository {
  private realm: Realm;

  constructor(realm: Realm) {
    this.realm = realm;
  }

  // Create a new quote
  createQuote(quote: IQuote): IQuote {
    try {
      let newQuote;
      this.realm.write(() => {
        // Create the quote
        newQuote = this.realm.create('Quote', {
          id: quote.id,
          patientId: quote.patientId,
          date: quote.date,
          items: [],
          subtotal: quote.subtotal,
          discountType: quote.discountType,
          discountValue: quote.discountValue,
          discountAmount: quote.discountAmount,
          taxPercentage: quote.taxPercentage,
          taxAmount: quote.taxAmount,
          total: quote.total,
          notes: quote.notes || '',
          status: quote.status,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Create quote items
        quote.items.forEach(item => {
          const newItem = this.realm.create('QuoteItem', {
            id: item.id,
            quoteId: quote.id,
            serviceId: item.serviceId,
            serviceName: item.serviceName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.amount,
            notes: item.notes || '',
          });
          newQuote.items.push(newItem);
        });
      });
      return newQuote;
    } catch (error) {
      console.error('Failed to create quote:', error);
      throw error;
    }
  }

  // Get all quotes
  getAllQuotes() {
    try {
      return this.realm.objects<IQuote>('Quote').sorted('date', true);
    } catch (error) {
      console.error('Failed to get quotes:', error);
      throw error;
    }
  }

  // Get quote by ID
  getQuoteById(id: string) {
    try {
      return this.realm.objectForPrimaryKey<IQuote>('Quote', id);
    } catch (error) {
      console.error('Failed to get quote by ID:', error);
      throw error;
    }
  }

  // Get quotes by patient ID
  getQuotesByPatientId(patientId: string) {
    try {
      return this.realm.objects<IQuote>('Quote')
        .filtered('patientId == $0', patientId)
        .sorted('date', true);
    } catch (error) {
      console.error('Failed to get quotes by patient ID:', error);
      throw error;
    }
  }

  // Get quotes by status
  getQuotesByStatus(status: string) {
    try {
      return this.realm.objects<IQuote>('Quote')
        .filtered('status == $0', status)
        .sorted('date', true);
    } catch (error) {
      console.error('Failed to get quotes by status:', error);
      throw error;
    }
  }

  // Get quotes by date range
  getQuotesByDateRange(startDate: Date, endDate: Date) {
    try {
      return this.realm.objects<IQuote>('Quote')
        .filtered('date >= $0 && date <= $1', startDate, endDate)
        .sorted('date', true);
    } catch (error) {
      console.error('Failed to get quotes by date range:', error);
      throw error;
    }
  }

  // Update quote
  updateQuote(id: string, updatedData: Partial<IQuote>) {
    try {
      const quote = this.getQuoteById(id);
      if (quote) {
        this.realm.write(() => {
          // Update quote properties
          Object.keys(updatedData).forEach(key => {
            if (key !== 'id' && key !== 'createdAt' && key !== 'items') {
              quote[key] = updatedData[key];
            }
          });
          quote.updatedAt = new Date();

          // Handle items update if provided
          if (updatedData.items) {
            // Delete existing items
            const existingItems = this.realm.objects('QuoteItem').filtered('quoteId == $0', id);
            this.realm.delete(existingItems);

            // Create new items
            updatedData.items.forEach(item => {
              const newItem = this.realm.create('QuoteItem', {
                id: item.id,
                quoteId: id,
                serviceId: item.serviceId,
                serviceName: item.serviceName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                amount: item.amount,
                notes: item.notes || '',
              });
              quote.items.push(newItem);
            });
          }
        });
        return quote;
      }
      return null;
    } catch (error) {
      console.error('Failed to update quote:', error);
      throw error;
    }
  }

  // Delete quote
  deleteQuote(id: string) {
    try {
      const quote = this.getQuoteById(id);
      if (quote) {
        this.realm.write(() => {
          // Delete quote items first
          const items = this.realm.objects('QuoteItem').filtered('quoteId == $0', id);
          this.realm.delete(items);
          
          // Then delete the quote
          this.realm.delete(quote);
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete quote:', error);
      throw error;
    }
  }

  // Calculate quote totals
  calculateQuoteTotals(items: IQuoteItem[], discountType: 'percentage' | 'fixed' | 'none', discountValue: number, taxPercentage: number) {
    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    
    // Calculate discount amount
    let discountAmount = 0;
    if (discountType === 'percentage') {
      discountAmount = subtotal * (discountValue / 100);
    } else if (discountType === 'fixed') {
      discountAmount = discountValue;
    }
    
    // Calculate tax amount
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (taxPercentage / 100);
    
    // Calculate total
    const total = taxableAmount + taxAmount;
    
    return {
      subtotal,
      discountAmount,
      taxAmount,
      total
    };
  }
}

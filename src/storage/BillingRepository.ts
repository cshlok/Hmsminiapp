import Realm from 'realm';
import { BillSchema, BillItemSchema, PaymentSchema } from '../models/BillingModel';
import { IBill, IBillItem, IPayment } from '../models/BillingModel';
import { v4 as uuidv4 } from 'uuid';

// Database configuration
export const billingDatabaseOptions = {
  schema: [BillSchema, BillItemSchema, PaymentSchema],
  schemaVersion: 1,
};

// Billing repository for CRUD operations
export class BillingRepository {
  private realm: Realm;

  constructor(realm: Realm) {
    this.realm = realm;
  }

  // Create a new bill
  createBill(bill: IBill): IBill {
    try {
      let newBill: IBill;
      
      this.realm.write(() => {
        // Create the bill
        newBill = this.realm.create('Bill', {
          id: bill.id || uuidv4(),
          patientId: bill.patientId,
          quoteId: bill.quoteId,
          date: bill.date,
          dueDate: bill.dueDate,
          items: [],
          subtotal: bill.subtotal,
          discountType: bill.discountType,
          discountValue: bill.discountValue,
          discountAmount: bill.discountAmount,
          taxPercentage: bill.taxPercentage,
          taxAmount: bill.taxAmount,
          total: bill.total,
          amountPaid: bill.amountPaid,
          balance: bill.balance,
          notes: bill.notes || '',
          status: bill.status,
          payments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }) as unknown as IBill;

        // Create bill items
        bill.items.forEach(item => {
          const newItem = this.realm.create('BillItem', {
            id: item.id || uuidv4(),
            billId: bill.id,
            serviceId: item.serviceId,
            serviceName: item.serviceName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.amount,
            notes: item.notes || '',
          });
          newBill.items.push(newItem as any);
        });

        // Create payments if any
        bill.payments.forEach(payment => {
          const newPayment = this.realm.create('Payment', {
            id: payment.id || uuidv4(),
            billId: bill.id,
            date: payment.date,
            amount: payment.amount,
            method: payment.method,
            reference: payment.reference || '',
            notes: payment.notes || '',
            createdAt: new Date(),
          });
          newBill.payments.push(newPayment as any);
        });
      });
      
      return newBill;
    } catch (error) {
      console.error('Failed to create bill:', error);
      throw error;
    }
  }

  // Get all bills
  getAllBills() {
    try {
      return this.realm.objects<IBill>('Bill').sorted('date', true);
    } catch (error) {
      console.error('Failed to get bills:', error);
      throw error;
    }
  }

  // Get bill by ID
  getBillById(id: string): IBill | null {
    try {
      return this.realm.objectForPrimaryKey<IBill>('Bill', id) || null;
    } catch (error) {
      console.error('Failed to get bill by ID:', error);
      throw error;
    }
  }

  // Get bills by patient ID
  getBillsByPatientId(patientId: string) {
    try {
      return this.realm.objects<IBill>('Bill')
        .filtered('patientId == $0', patientId)
        .sorted('date', true);
    } catch (error) {
      console.error('Failed to get bills by patient ID:', error);
      throw error;
    }
  }

  // Get bills by status
  getBillsByStatus(status: string) {
    try {
      return this.realm.objects<IBill>('Bill')
        .filtered('status == $0', status)
        .sorted('date', true);
    } catch (error) {
      console.error('Failed to get bills by status:', error);
      throw error;
    }
  }

  // Get bills by date range
  getBillsByDateRange(startDate: Date, endDate: Date) {
    try {
      return this.realm.objects<IBill>('Bill')
        .filtered('date >= $0 && date <= $1', startDate, endDate)
        .sorted('date', true);
    } catch (error) {
      console.error('Failed to get bills by date range:', error);
      throw error;
    }
  }

  // Get overdue bills
  getOverdueBills() {
    try {
      const today = new Date();
      return this.realm.objects<IBill>('Bill')
        .filtered('dueDate < $0 && status != "paid" && status != "cancelled"', today)
        .sorted('dueDate');
    } catch (error) {
      console.error('Failed to get overdue bills:', error);
      throw error;
    }
  }

  // Update bill
  updateBill(id: string, updatedData: Partial<IBill>): IBill | null {
    try {
      const bill = this.getBillById(id);
      if (bill) {
        this.realm.write(() => {
          // Update bill properties
          Object.keys(updatedData).forEach(key => {
            if (key !== 'id' && key !== 'createdAt' && key !== 'items' && key !== 'payments') {
              // Type-safe property access
              const typedKey = key as keyof IBill;
              if (updatedData[typedKey] !== undefined) {
                (bill as any)[key] = updatedData[typedKey];
              }
            }
          });
          bill.updatedAt = new Date();

          // Handle items update if provided
          if (updatedData.items) {
            // Delete existing items
            const existingItems = this.realm.objects('BillItem').filtered('billId == $0', id);
            this.realm.delete(existingItems);
            bill.items = [];

            // Create new items
            updatedData.items.forEach(item => {
              const newItem = this.realm.create('BillItem', {
                id: item.id || uuidv4(),
                billId: id,
                serviceId: item.serviceId,
                serviceName: item.serviceName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                amount: item.amount,
                notes: item.notes || '',
              });
              bill.items.push(newItem as any);
            });
          }

          // Handle payments update if provided
          if (updatedData.payments) {
            // Delete existing payments
            const existingPayments = this.realm.objects('Payment').filtered('billId == $0', id);
            this.realm.delete(existingPayments);
            bill.payments = [];

            // Create new payments
            updatedData.payments.forEach(payment => {
              const newPayment = this.realm.create('Payment', {
                id: payment.id || uuidv4(),
                billId: id,
                date: payment.date,
                amount: payment.amount,
                method: payment.method,
                reference: payment.reference || '',
                notes: payment.notes || '',
                createdAt: payment.createdAt || new Date(),
              });
              bill.payments.push(newPayment as any);
            });
          }
        });
        return bill;
      }
      return null;
    } catch (error) {
      console.error('Failed to update bill:', error);
      throw error;
    }
  }

  // Delete bill
  deleteBill(id: string): boolean {
    try {
      const bill = this.getBillById(id);
      if (bill) {
        this.realm.write(() => {
          // Delete bill items first
          const items = this.realm.objects('BillItem').filtered('billId == $0', id);
          this.realm.delete(items);
          
          // Delete payments
          const payments = this.realm.objects('Payment').filtered('billId == $0', id);
          this.realm.delete(payments);
          
          // Then delete the bill
          this.realm.delete(bill);
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete bill:', error);
      throw error;
    }
  }

  // Add payment to bill
  addPayment(billId: string, payment: IPayment): IBill | null {
    try {
      const bill = this.getBillById(billId);
      if (bill) {
        this.realm.write(() => {
          // Create new payment
          const newPayment = this.realm.create('Payment', {
            id: payment.id || uuidv4(),
            billId: billId,
            date: payment.date,
            amount: payment.amount,
            method: payment.method,
            reference: payment.reference || '',
            notes: payment.notes || '',
            createdAt: new Date(),
          });
          bill.payments.push(newPayment as any);
          
          // Update bill amount paid and balance
          bill.amountPaid += payment.amount;
          bill.balance = bill.total - bill.amountPaid;
          
          // Update bill status
          if (bill.balance <= 0) {
            bill.status = 'paid';
          } else if (bill.amountPaid > 0) {
            bill.status = 'partially_paid';
          }
          
          bill.updatedAt = new Date();
        });
        return bill;
      }
      return null;
    } catch (error) {
      console.error('Failed to add payment:', error);
      throw error;
    }
  }

  // Delete payment
  deletePayment(paymentId: string): boolean {
    try {
      const payment = this.realm.objectForPrimaryKey<IPayment>('Payment', paymentId);
      if (payment) {
        const billId = payment.billId;
        const bill = this.getBillById(billId);
        
        if (bill) {
          this.realm.write(() => {
            // Update bill amount paid and balance
            bill.amountPaid -= payment.amount;
            bill.balance = bill.total - bill.amountPaid;
            
            // Update bill status
            if (bill.amountPaid <= 0) {
              bill.status = 'unpaid';
            } else if (bill.amountPaid < bill.total) {
              bill.status = 'partially_paid';
            }
            
            bill.updatedAt = new Date();
            
            // Delete the payment
            this.realm.delete(payment);
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to delete payment:', error);
      throw error;
    }
  }

  // Calculate bill totals
  calculateBillTotals(items: IBillItem[], discountType: 'percentage' | 'fixed' | 'none', discountValue: number, taxPercentage: number) {
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

  // Update bill status based on due date
  updateBillStatusBasedOnDueDate(billId: string): IBill | null {
    try {
      const bill = this.getBillById(billId);
      if (bill && bill.status !== 'paid' && bill.status !== 'cancelled') {
        const today = new Date();
        
        this.realm.write(() => {
          if (bill.dueDate < today) {
            bill.status = 'overdue';
          }
          bill.updatedAt = new Date();
        });
        return bill;
      }
      return null;
    } catch (error) {
      console.error('Failed to update bill status:', error);
      throw error;
    }
  }
}

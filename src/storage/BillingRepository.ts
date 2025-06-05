import { IBill } from '../models/BillingModel';

export class BillingRepository {
  private bills: IBill[] = [];

  async getAllBills(): Promise<IBill[]> {
    return this.bills;
  }

  async getBillById(id: string): Promise<IBill | null> {
    return this.bills.find(item => item.id === id) || null;
  }

  async saveBill(item: IBill): Promise<IBill> {
    const existing = this.bills.findIndex(i => i.id === item.id);
    if (existing >= 0) {
      this.bills[existing] = item;
    } else {
      this.bills.push(item);
    }
    return item;
  }

  async deleteBill(id: string): Promise<boolean> {
    const index = this.bills.findIndex(item => item.id === id);
    if (index >= 0) {
      this.bills.splice(index, 1);
      return true;
    }
    return false;
  }
}

export default new BillingRepository();

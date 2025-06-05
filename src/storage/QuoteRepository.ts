import { IQuote } from '../models/QuoteModel';

export class QuoteRepository {
  private quotes: IQuote[] = [];

  async getAllQuotes(): Promise<IQuote[]> {
    return this.quotes;
  }

  async getQuoteById(id: string): Promise<IQuote | null> {
    return this.quotes.find(item => item.id === id) || null;
  }

  async saveQuote(item: IQuote): Promise<IQuote> {
    const existing = this.quotes.findIndex(i => i.id === item.id);
    if (existing >= 0) {
      this.quotes[existing] = item;
    } else {
      this.quotes.push(item);
    }
    return item;
  }

  async deleteQuote(id: string): Promise<boolean> {
    const index = this.quotes.findIndex(item => item.id === id);
    if (index >= 0) {
      this.quotes.splice(index, 1);
      return true;
    }
    return false;
  }
}

export default new QuoteRepository();

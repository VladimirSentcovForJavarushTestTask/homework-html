import { Counterparty } from '../app/types';

export class CounterpartyService {
  private static instance: CounterpartyService;
  private counterparties: Counterparty[] = [];

  private constructor() {
    // Initialize with some sample data
    this.counterparties = [
      {
        id: crypto.randomUUID(),
        name: 'ООО Компания 42',
        inn: '12345678901',
        address: 'г. Москва, ул. Примерная, д. 1',
        kpp: '123456789',
      },
      {
        id: crypto.randomUUID(),
        name: 'ИП Иванов И.И.',
        inn: '98765432101',
        address: 'г. Санкт-Петербург, пр. Невский, д. 2',
        kpp: '987654321',
      },
    ];
  }

  public static getInstance(): CounterpartyService {
    if (!CounterpartyService.instance) {
      CounterpartyService.instance = new CounterpartyService();
    }
    return CounterpartyService.instance;
  }

  async getAllCounterparties(): Promise<Counterparty[]> {
    return [...this.counterparties];
  }

  async getCounterpartyById(id: string): Promise<Counterparty> {
    const counterparty = this.counterparties.find((c) => c.id === id);
    if (!counterparty) {
      throw new Error(`Counterparty with id ${id} not found`);
    }
    return { ...counterparty };
  }

  async createCounterparty(counterparty: Omit<Counterparty, 'id'>): Promise<Counterparty[]> {
    const newCounterparty: Counterparty = {
      ...counterparty,
      id: crypto.randomUUID(),
    };

    this.counterparties.push(newCounterparty);
    this.counterparties = [...this.counterparties];
    return [...this.counterparties];
  }

  async updateCounterparty(
    id: string,
    counterparty: Partial<Counterparty>
  ): Promise<Counterparty[]> {
    const index = this.counterparties.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Counterparty with id ${id} not found`);
    }

    const updatedCounterparty = {
      ...this.counterparties[index],
      ...counterparty,
    };

    this.counterparties[index] = updatedCounterparty;
    this.counterparties = [...this.counterparties];
    return [...this.counterparties];
  }

  async deleteCounterparty(id: string): Promise<Counterparty[]> {
    const index = this.counterparties.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Counterparty with id ${id} not found`);
    }
    this.counterparties.splice(index, 1);
    this.counterparties = [...this.counterparties];
    return [...this.counterparties];
  }
}

// Export a single instance
export default CounterpartyService.getInstance();

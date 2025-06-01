import { Counterparty } from '../app/types';

/**
 * Service class for managing counterparty data
 * Implements the Singleton pattern to ensure a single instance throughout the application
 * 
 * @class CounterpartyService
 * @description Handles CRUD operations for counterparties with in-memory storage
 */
export class CounterpartyService {
  private static instance: CounterpartyService;
  private counterparties: Counterparty[] = [];

  /**
   * Private constructor to prevent direct instantiation
   * Initializes the service with sample data
   * @private
   */
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

  /**
   * Gets the singleton instance of the service
   * @returns {CounterpartyService} The singleton instance
   * @public
   */
  public static getInstance(): CounterpartyService {
    if (!CounterpartyService.instance) {
      CounterpartyService.instance = new CounterpartyService();
    }
    return CounterpartyService.instance;
  }

  /**
   * Retrieves all counterparties
   * @returns {Promise<Counterparty[]>} Promise resolving to an array of all counterparties
   * @public
   */
  async getAllCounterparties(): Promise<Counterparty[]> {
    return [...this.counterparties];
  }

  /**
   * Retrieves a single counterparty by ID
   * @param {string} id - The ID of the counterparty to retrieve
   * @returns {Promise<Counterparty>} Promise resolving to the requested counterparty
   * @throws {Error} If no counterparty is found with the given ID
   * @public
   */
  async getCounterpartyById(id: string): Promise<Counterparty> {
    const counterparty = this.counterparties.find((c) => c.id === id);
    if (!counterparty) {
      throw new Error(`Counterparty with id ${id} not found`);
    }
    return { ...counterparty };
  }

  /**
   * Creates a new counterparty
   * @param {Omit<Counterparty, 'id'>} counterparty - The counterparty data to create
   * @returns {Promise<Counterparty[]>} Promise resolving to the updated array of counterparties
   * @public
   */
  async createCounterparty(counterparty: Omit<Counterparty, 'id'>): Promise<Counterparty[]> {
    const newCounterparty: Counterparty = {
      ...counterparty,
      id: crypto.randomUUID(),
    };

    this.counterparties.push(newCounterparty);
    this.counterparties = [...this.counterparties];
    return [...this.counterparties];
  }

  /**
   * Updates an existing counterparty
   * @param {string} id - The ID of the counterparty to update
   * @param {Partial<Counterparty>} counterparty - The updated counterparty data
   * @returns {Promise<Counterparty[]>} Promise resolving to the updated array of counterparties
   * @throws {Error} If no counterparty is found with the given ID
   * @public
   */
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

  /**
   * Deletes a counterparty
   * @param {string} id - The ID of the counterparty to delete
   * @returns {Promise<Counterparty[]>} Promise resolving to the updated array of counterparties
   * @throws {Error} If no counterparty is found with the given ID
   * @public
   */
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

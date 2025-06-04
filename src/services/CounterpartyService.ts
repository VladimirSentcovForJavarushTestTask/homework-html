import { Counterparty, CounterpartyFormData } from '../app/types';

/**
 * Base URL for the API endpoints
 * @constant
 */
const API_URL = 'http://localhost:3001';

/**
 * Service class for managing counterparty data
 * @class CounterpartyService
 * @description Handles CRUD operations for counterparties through REST API
 * Implements the Singleton pattern to ensure a single instance throughout the application
 *
 * @example
 * // Get service instance
 * const service = CounterpartyService.getInstance();
 *
 * // Get all counterparties
 * const counterparties = await service.getAllCounterparties();
 */
export class CounterpartyService {
  private static instance: CounterpartyService;

  /**
   * Private constructor to prevent direct instantiation
   * @private
   */
  private constructor() {}

  /**
   * Gets the singleton instance of the service
   * @returns {CounterpartyService} The singleton instance
   * @public
   * @static
   *
   * @example
   * const service = CounterpartyService.getInstance();
   */
  public static getInstance(): CounterpartyService {
    if (!CounterpartyService.instance) {
      CounterpartyService.instance = new CounterpartyService();
    }
    return CounterpartyService.instance;
  }

  /**
   * Retrieves all counterparties from the API
   * @returns {Promise<Counterparty[]>} Promise resolving to an array of all counterparties
   * @throws {Error} If the API request fails
   * @public
   *
   * @example
   * try {
   *   const counterparties = await service.getAllCounterparties();
   *   console.log(counterparties);
   * } catch (error) {
   *   console.error('Failed to fetch counterparties:', error);
   * }
   */
  async getAllCounterparties(): Promise<Counterparty[]> {
    try {
      const response = await fetch(`${API_URL}/counterparties`);
      if (!response.ok) {
        throw new Error('Failed to fetch counterparties');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching counterparties:', error);
      throw error;
    }
  }

  /**
   * Retrieves a single counterparty by ID
   * @param {string} id - The ID of the counterparty to retrieve
   * @returns {Promise<Counterparty>} Promise resolving to the requested counterparty
   * @throws {Error} If the API request fails or counterparty is not found
   * @public
   *
   * @example
   * try {
   *   const counterparty = await service.getCounterpartyById('123');
   *   console.log(counterparty);
   * } catch (error) {
   *   console.error('Failed to fetch counterparty:', error);
   * }
   */
  async getCounterpartyById(id: string): Promise<Counterparty> {
    try {
      const response = await fetch(`${API_URL}/counterparties/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch counterparty with id ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching counterparty ${id}:`, error);
      throw error;
    }
  }

  /**
   * Creates a new counterparty
   * @param {CounterpartyFormData} counterpartyFormData - The counterparty data to create
   * @returns {Promise<Counterparty[]>} Promise resolving to the updated array of counterparties
   * @throws {Error} If the API request fails
   * @public
   *
   * @example
   * try {
   *   const newCounterparty = {
   *     name: 'ООО Компания',
   *     inn: '12345678901',
   *     address: 'г. Москва',
   *     kpp: '123456789'
   *   };
   *   const updatedList = await service.createCounterparty(newCounterparty);
   *   console.log(updatedList);
   * } catch (error) {
   *   console.error('Failed to create counterparty:', error);
   * }
   */
  async createCounterparty(counterpartyFormData: CounterpartyFormData): Promise<Counterparty[]> {
    const counterparty: Counterparty = { ...counterpartyFormData, id: crypto.randomUUID() };
    try {
      const response = await fetch(`${API_URL}/counterparties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(counterparty),
      });
      if (!response.ok) {
        throw new Error('Failed to create counterparty');
      }
      return await this.getAllCounterparties();
    } catch (error) {
      console.error('Error creating counterparty:', error);
      throw error;
    }
  }

  /**
   * Updates an existing counterparty
   * @param {string} id - The ID of the counterparty to update
   * @param {Partial<Counterparty>} counterparty - The updated counterparty data
   * @returns {Promise<Counterparty[]>} Promise resolving to the updated array of counterparties
   * @throws {Error} If the API request fails or counterparty is not found
   * @public
   *
   * @example
   * try {
   *   const updates = {
   *     name: 'Новое название',
   *     address: 'Новый адрес'
   *   };
   *   const updatedList = await service.updateCounterparty('123', updates);
   *   console.log(updatedList);
   * } catch (error) {
   *   console.error('Failed to update counterparty:', error);
   * }
   */
  async updateCounterparty(
    id: string,
    counterparty: Partial<Counterparty>
  ): Promise<Counterparty[]> {
    try {
      const response = await fetch(`${API_URL}/counterparties/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(counterparty),
      });
      if (!response.ok) {
        throw new Error(`Failed to update counterparty with id ${id}`);
      }
      const allCounterparties = await this.getAllCounterparties();
      return allCounterparties;
    } catch (error) {
      console.error(`Error updating counterparty ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deletes a counterparty
   * @param {string} id - The ID of the counterparty to delete
   * @returns {Promise<Counterparty[]>} Promise resolving to the updated array of counterparties
   * @throws {Error} If the API request fails or counterparty is not found
   * @public
   *
   * @example
   * try {
   *   const updatedList = await service.deleteCounterparty('123');
   *   console.log(updatedList);
   * } catch (error) {
   *   console.error('Failed to delete counterparty:', error);
   * }
   */
  async deleteCounterparty(id: string): Promise<Counterparty[]> {
    try {
      const response = await fetch(`${API_URL}/counterparties/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete counterparty with id ${id}`);
      }
      const allCounterparties = await this.getAllCounterparties();
      return allCounterparties;
    } catch (error) {
      console.error(`Error deleting counterparty ${id}:`, error);
      throw error;
    }
  }
}

// Export a single instance
export default CounterpartyService.getInstance();

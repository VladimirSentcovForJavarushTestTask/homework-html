import { Counterparty } from '../app/types';
import apiService from './ApiService';

/**
 * Service class for managing counterparty data
 * @class CounterpartyService
 * @description Handles CRUD operations for counterparties through REST API
 * Implements the Singleton pattern to ensure a single instance throughout the application
 *
 * Features:
 * - Singleton pattern implementation
 * - CRUD operations for counterparties
 * - Error handling and logging
 * - Automatic data refresh after operations
 * - Type safety with TypeScript
 *
 * @example
 * // Get service instance
 * const service = CounterpartyService.getInstance();
 *
 * // Get all counterparties
 * const counterparties = await service.getAllCounterparties();
 *
 * // Create a new counterparty
 * const newCounterparty = {
 *   name: 'ООО Компания',
 *   inn: '12345678901',
 *   address: 'г. Москва',
 *   kpp: '123456789'
 * };
 * const updatedList = await service.createCounterparty(newCounterparty);
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
   * Creates a new instance if one doesn't exist
   *
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
   * Fetches the complete list of counterparties and handles any errors
   *
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
      const response = await apiService.get('/counterparties');
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
   * Fetches detailed information about a specific counterparty
   *
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
      const response = await apiService.get(`/counterparties/${id}`);
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
   * Adds a new counterparty to the system and returns the updated list
   *
   * @param {Counterparty} counterparty - The counterparty data to create
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
  async createCounterparty(counterparty: Counterparty): Promise<Counterparty[]> {
    try {
      const response = await apiService.post('/counterparties', counterparty);
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
   * Modifies the data of an existing counterparty and returns the updated list
   *
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
      const response = await apiService.put(`/counterparties/${id}`, counterparty);
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
   * Removes a counterparty from the system and returns the updated list
   *
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
      const response = await apiService.delete(`/counterparties/${id}`);
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

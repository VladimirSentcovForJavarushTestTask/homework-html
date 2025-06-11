/* eslint-disable no-undef */
/**
 * HTTP methods supported by the API service
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Configuration options for API requests
 */
interface RequestConfig extends RequestInit {
  method: HttpMethod;
  headers?: HeadersInit;
  body?: BodyInit;
}

/**
 * API Service class implementing the Singleton pattern
 * @class ApiService
 * @description Handles all HTTP requests in the application
 *
 * @example
 * // Get service instance
 * const api = ApiService.getInstance();
 *
 * // Make a GET request
 * const data = await api.request('/users');
 *
 * // Make a POST request with data
 * const response = await api.request('/users', {
 *   method: 'POST',
 *   body: JSON.stringify({ name: 'John' })
 * });
 */
export class ApiService {
  private static instance: ApiService;
  private baseUrl: string;

  /**
   * Private constructor to prevent direct instantiation
   * @private
   */
  private constructor() {
    this.baseUrl = 'http://localhost:3001';
  }

  /**
   * Gets the singleton instance of the service
   * @returns {ApiService} The singleton instance
   * @public
   * @static
   */
  public static getInstance(url?: string): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    if (url) {
      ApiService.instance.baseUrl = url;
    }
    return ApiService.instance;
  }

  /**
   * Makes an HTTP request to the specified endpoint
   * @param {string} endpoint - The API endpoint
   * @param {RequestConfig} [config] - Optional request configuration
   * @returns {Promise<T>} Promise resolving to the response data
   * @throws {Error} If the request fails
   * @public
   *
   * @example
   * // GET request
   * const users = await api.request('/users');
   *
   * // POST request with data
   * const newUser = await api.request('/users', {
   *   method: 'POST',
   *   body: JSON.stringify({ name: 'John' })
   * });
   */
  private async request(endpoint: string, config?: RequestConfig): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultConfig: RequestConfig = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return fetch(url, { ...defaultConfig, ...config });
  }

  /**
   * Makes a GET request to the specified endpoint
   * @param {string} endpoint - The API endpoint
   * @returns {Promise<Response>} Promise resolving to the response data
   * @public
   */
  public async get(endpoint: string): Promise<Response> {
    return this.request(endpoint, { method: 'GET' });
  }

  /**
   * Makes a POST request to the specified endpoint
   * @param {string} endpoint - The API endpoint
   * @param {object} data - The data to send
   * @returns {Promise<Response>} Promise resolving to the response data
   * @public
   */
  public async post(endpoint: string, data: any): Promise<Response> {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Makes a PUT request to the specified endpoint
   * @param {string} endpoint - The API endpoint
   * @param {any} data - The data to send
   * @returns {Promise<Response>} Promise resolving to the response data
   * @public
   */
  public async put(endpoint: string, data: any): Promise<Response> {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Makes a PUT request to the specified endpoint
   * @param {string} endpoint - The API endpoint
   * @param {object} data - The data to send
   * @returns {Promise<Response>} Promise resolving to the response data
   * @public
   */
  public async patch(endpoint: string, data: any): Promise<Response> {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Makes a DELETE request to the specified endpoint
   * @param {string} endpoint - The API endpoint
   * @returns {Promise<Response>} Promise resolving to the response data
   * @public
   */
  public async delete(endpoint: string): Promise<Response> {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Export a single instance
export default ApiService.getInstance();

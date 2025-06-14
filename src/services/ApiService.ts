/* eslint-disable no-undef */
/**
 * HTTP methods supported by the API service
 * @typedef {('GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH')} HttpMethod
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Configuration options for API requests
 * @interface RequestConfig
 * @extends {RequestInit}
 * @property {HttpMethod} method - The HTTP method to use
 * @property {HeadersInit} [headers] - Optional headers for the request
 * @property {BodyInit} [body] - Optional request body
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
 * Provides methods for making HTTP requests with proper error handling and response parsing
 *
 * Features:
 * - Singleton pattern implementation
 * - Base URL configuration
 * - Default headers and request options
 * - Methods for all common HTTP operations
 * - Error handling and response parsing
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
   * Initializes the base URL for API requests
   * @private
   */
  private constructor() {
    this.baseUrl = 'http://localhost:3001';
  }

  /**
   * Gets the singleton instance of the service
   * Creates a new instance if one doesn't exist
   * Optionally updates the base URL if provided
   *
   * @param {string} [url] - Optional new base URL
   * @returns {ApiService} The singleton instance
   * @public
   * @static
   *
   * @example
   * // Get default instance
   * const api = ApiService.getInstance();
   *
   * // Get instance with custom URL
   * const api = ApiService.getInstance('https://api.example.com');
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
   * Handles request configuration, error handling, and response parsing
   *
   * @param {string} endpoint - The API endpoint
   * @param {RequestConfig} [config] - Optional request configuration
   * @returns {Promise<Response>} Promise resolving to the response
   * @throws {Error} If the request fails
   * @private
   *
   * @example
   * // GET request
   * const response = await this.request('/users');
   *
   * // POST request with data
   * const response = await this.request('/users', {
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
   *
   * @param {string} endpoint - The API endpoint
   * @returns {Promise<Response>} Promise resolving to the response
   * @public
   *
   * @example
   * const response = await api.get('/users');
   * const data = await response.json();
   */
  public async get(endpoint: string): Promise<Response> {
    return this.request(endpoint, { method: 'GET' });
  }

  /**
   * Makes a POST request to the specified endpoint
   * Automatically stringifies the request body
   *
   * @param {string} endpoint - The API endpoint
   * @param {object} data - The data to send
   * @returns {Promise<Response>} Promise resolving to the response
   * @public
   *
   * @example
   * const response = await api.post('/users', { name: 'John' });
   * const data = await response.json();
   */
  public async post(endpoint: string, data: any): Promise<Response> {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Makes a PUT request to the specified endpoint
   * Automatically stringifies the request body
   *
   * @param {string} endpoint - The API endpoint
   * @param {any} data - The data to send
   * @returns {Promise<Response>} Promise resolving to the response
   * @public
   *
   * @example
   * const response = await api.put('/users/123', { name: 'John' });
   * const data = await response.json();
   */
  public async put(endpoint: string, data: any): Promise<Response> {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Makes a PATCH request to the specified endpoint
   * Automatically stringifies the request body
   *
   * @param {string} endpoint - The API endpoint
   * @param {object} data - The data to send
   * @returns {Promise<Response>} Promise resolving to the response
   * @public
   *
   * @example
   * const response = await api.patch('/users/123', { name: 'John' });
   * const data = await response.json();
   */
  public async patch(endpoint: string, data: any): Promise<Response> {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Makes a DELETE request to the specified endpoint
   *
   * @param {string} endpoint - The API endpoint
   * @returns {Promise<Response>} Promise resolving to the response
   * @public
   *
   * @example
   * const response = await api.delete('/users/123');
   * const data = await response.json();
   */
  public async delete(endpoint: string): Promise<Response> {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Export a single instance
export default ApiService.getInstance();

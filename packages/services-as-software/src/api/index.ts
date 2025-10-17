/**
 * Services-as-Software API client
 */

import type { Service, ServiceDeployment, ServiceRequest, ServiceResponse, ServiceIntegration, ServiceRegistryEntry, GatewayRoute } from '../types/index.js'

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public body: any,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Custom error class for validation errors
 */
export class ValidationError extends Error {
  constructor(
    public field: string,
    message: string
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * Validation helper functions
 */
function validateRequired(value: any, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new ValidationError(fieldName, `${fieldName} is required`)
  }
}

function validateString(value: any, fieldName: string): void {
  if (typeof value !== 'string') {
    throw new ValidationError(fieldName, `${fieldName} must be a string`)
  }
}

function validateObject(value: any, fieldName: string): void {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new ValidationError(fieldName, `${fieldName} must be an object`)
  }
}

/**
 * API configuration
 */
export interface ApiConfig {
  baseUrl?: string
  apiKey?: string
  headers?: Record<string, string>
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: 'https://apis.do',
}

/**
 * Services API client
 */
export class ServicesApi {
  private config: ApiConfig

  constructor(config: ApiConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}${path}`
    const headers = {
      'Content-Type': 'application/json',
      ...this.config.headers,
      ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      let errorBody: any
      try {
        errorBody = await response.json()
      } catch {
        errorBody = await response.text()
      }

      throw new ApiError(response.status, errorBody, `API request failed [${response.status}]: ${errorBody?.message || response.statusText}`)
    }

    return response.json()
  }

  /**
   * Service lifecycle management
   */
  services = {
    /**
     * Create a new service
     */
    create: async (service: Omit<Service, 'id'>): Promise<Service> => {
      validateRequired(service, 'service')
      validateObject(service, 'service')

      return this.request<Service>('/services', {
        method: 'POST',
        body: JSON.stringify(service),
      })
    },

    /**
     * List all services
     */
    list: async (): Promise<Service[]> => {
      return this.request<Service[]>('/services')
    },

    /**
     * Get a service by ID
     */
    get: async (id: string): Promise<Service> => {
      validateRequired(id, 'id')
      validateString(id, 'id')

      return this.request<Service>(`/services/${id}`)
    },

    /**
     * Update a service
     */
    update: async (id: string, updates: Partial<Service>): Promise<Service> => {
      validateRequired(id, 'id')
      validateString(id, 'id')
      validateRequired(updates, 'updates')
      validateObject(updates, 'updates')

      return this.request<Service>(`/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      })
    },

    /**
     * Delete a service
     */
    delete: async (id: string): Promise<void> => {
      validateRequired(id, 'id')
      validateString(id, 'id')

      return this.request<void>(`/services/${id}`, {
        method: 'DELETE',
      })
    },
  }

  /**
   * Service deployment management
   */
  deployments = {
    /**
     * Deploy a service
     */
    deploy: async (serviceId: string, environment: 'development' | 'staging' | 'production', config?: any): Promise<ServiceDeployment> => {
      return this.request<ServiceDeployment>('/deployments', {
        method: 'POST',
        body: JSON.stringify({ serviceId, environment, config }),
      })
    },

    /**
     * List deployments
     */
    list: async (serviceId?: string): Promise<ServiceDeployment[]> => {
      const path = serviceId ? `/deployments?serviceId=${serviceId}` : '/deployments'
      return this.request<ServiceDeployment[]>(path)
    },

    /**
     * Get deployment status
     */
    get: async (id: string): Promise<ServiceDeployment> => {
      return this.request<ServiceDeployment>(`/deployments/${id}`)
    },

    /**
     * Rollback a deployment
     */
    rollback: async (id: string): Promise<ServiceDeployment> => {
      return this.request<ServiceDeployment>(`/deployments/${id}/rollback`, {
        method: 'POST',
      })
    },
  }

  /**
   * Service invocation
   */
  invoke = {
    /**
     * Invoke a service operation
     */
    call: async <TInput, TOutput>(serviceId: string, operation: string, input: TInput): Promise<ServiceResponse<TOutput>> => {
      const request: ServiceRequest<TInput> = {
        id: crypto.randomUUID(),
        operation,
        input,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      }

      return this.request<ServiceResponse<TOutput>>(`/services/${serviceId}/invoke`, {
        method: 'POST',
        body: JSON.stringify(request),
      })
    },

    /**
     * Invoke via API Gateway
     */
    gateway: async <TOutput>(method: string, path: string, body?: any): Promise<TOutput> => {
      return this.request<TOutput>(path, {
        method: method.toUpperCase(),
        ...(body ? { body: JSON.stringify(body) } : {}),
      })
    },
  }

  /**
   * Service integrations
   */
  integrations = {
    /**
     * Create an integration between services
     */
    create: async (integration: Omit<ServiceIntegration, 'id'>): Promise<ServiceIntegration> => {
      return this.request<ServiceIntegration>('/integrations', {
        method: 'POST',
        body: JSON.stringify(integration),
      })
    },

    /**
     * List integrations
     */
    list: async (): Promise<ServiceIntegration[]> => {
      return this.request<ServiceIntegration[]>('/integrations')
    },

    /**
     * Enable/disable an integration
     */
    toggle: async (id: string, enabled: boolean): Promise<ServiceIntegration> => {
      return this.request<ServiceIntegration>(`/integrations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ enabled }),
      })
    },
  }

  /**
   * Service registry
   */
  registry = {
    /**
     * Register a service
     */
    register: async (entry: Omit<ServiceRegistryEntry, 'registeredAt'>): Promise<ServiceRegistryEntry> => {
      return this.request<ServiceRegistryEntry>('/registry', {
        method: 'POST',
        body: JSON.stringify(entry),
      })
    },

    /**
     * List all registered services
     */
    list: async (): Promise<ServiceRegistryEntry[]> => {
      return this.request<ServiceRegistryEntry[]>('/registry')
    },

    /**
     * Discover a service by name
     */
    discover: async (name: string): Promise<ServiceRegistryEntry> => {
      return this.request<ServiceRegistryEntry>(`/registry/${name}`)
    },

    /**
     * Heartbeat to keep service alive
     */
    heartbeat: async (serviceId: string): Promise<void> => {
      return this.request<void>(`/registry/${serviceId}/heartbeat`, {
        method: 'POST',
      })
    },

    /**
     * Unregister a service
     */
    unregister: async (serviceId: string): Promise<void> => {
      return this.request<void>(`/registry/${serviceId}`, {
        method: 'DELETE',
      })
    },
  }

  /**
   * API Gateway routes
   */
  gateway = {
    /**
     * Create a gateway route
     */
    createRoute: async (route: GatewayRoute): Promise<GatewayRoute> => {
      return this.request<GatewayRoute>('/gateway/routes', {
        method: 'POST',
        body: JSON.stringify(route),
      })
    },

    /**
     * List all routes
     */
    listRoutes: async (): Promise<GatewayRoute[]> => {
      return this.request<GatewayRoute[]>('/gateway/routes')
    },

    /**
     * Update a route
     */
    updateRoute: async (path: string, updates: Partial<GatewayRoute>): Promise<GatewayRoute> => {
      return this.request<GatewayRoute>(`/gateway/routes${path}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      })
    },

    /**
     * Delete a route
     */
    deleteRoute: async (path: string): Promise<void> => {
      return this.request<void>(`/gateway/routes${path}`, {
        method: 'DELETE',
      })
    },
  }
}

/**
 * Create a new Services API client
 */
export function createServicesApi(config?: ApiConfig): ServicesApi {
  return new ServicesApi(config)
}

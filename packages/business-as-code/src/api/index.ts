/**
 * Business-as-Code API client for apis.do
 */

import type {
  BusinessFunction,
  BusinessWorkflow,
  BusinessAgent,
  BusinessResource,
  BusinessAction,
  BusinessEvent,
  BusinessQuery,
  BusinessMetric,
} from '../types/index.js'

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
 * Base API configuration
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
 * Base API client
 */
export class BusinessApi {
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
   * Functions API
   */
  functions = {
    execute: async <TInput, TOutput>(functionId: string, input: TInput): Promise<TOutput> => {
      validateRequired(functionId, 'functionId')
      validateString(functionId, 'functionId')
      validateRequired(input, 'input')

      return this.request<TOutput>('/functions/execute', {
        method: 'POST',
        body: JSON.stringify({ functionId, input }),
      })
    },

    list: async (): Promise<BusinessFunction[]> => {
      return this.request<BusinessFunction[]>('/functions')
    },

    get: async (id: string): Promise<BusinessFunction> => {
      validateRequired(id, 'id')
      validateString(id, 'id')

      return this.request<BusinessFunction>(`/functions/${id}`)
    },

    create: async (fn: Omit<BusinessFunction, 'id'>): Promise<BusinessFunction> => {
      validateRequired(fn, 'function')
      validateObject(fn, 'function')

      return this.request<BusinessFunction>('/functions', {
        method: 'POST',
        body: JSON.stringify(fn),
      })
    },
  }

  /**
   * Workflows API
   */
  workflows = {
    trigger: async (workflowId: string, input?: any): Promise<{ executionId: string }> => {
      return this.request<{ executionId: string }>('/workflows/trigger', {
        method: 'POST',
        body: JSON.stringify({ workflowId, input }),
      })
    },

    list: async (): Promise<BusinessWorkflow[]> => {
      return this.request<BusinessWorkflow[]>('/workflows')
    },

    get: async (id: string): Promise<BusinessWorkflow> => {
      return this.request<BusinessWorkflow>(`/workflows/${id}`)
    },

    create: async (workflow: Omit<BusinessWorkflow, 'id'>): Promise<BusinessWorkflow> => {
      return this.request<BusinessWorkflow>('/workflows', {
        method: 'POST',
        body: JSON.stringify(workflow),
      })
    },

    status: async (executionId: string): Promise<{ status: string; result?: any }> => {
      return this.request<{ status: string; result?: any }>(`/workflows/executions/${executionId}`)
    },
  }

  /**
   * Agents API
   */
  agents = {
    create: async (agent: Omit<BusinessAgent, 'id'>): Promise<BusinessAgent> => {
      return this.request<BusinessAgent>('/agents', {
        method: 'POST',
        body: JSON.stringify(agent),
      })
    },

    list: async (): Promise<BusinessAgent[]> => {
      return this.request<BusinessAgent[]>('/agents')
    },

    get: async (id: string): Promise<BusinessAgent> => {
      return this.request<BusinessAgent>(`/agents/${id}`)
    },

    assign: async (agentId: string, task: any): Promise<{ taskId: string }> => {
      return this.request<{ taskId: string }>(`/agents/${agentId}/assign`, {
        method: 'POST',
        body: JSON.stringify(task),
      })
    },
  }

  /**
   * Resources API (nouns/objects)
   */
  resources = {
    create: async (resource: BusinessResource): Promise<BusinessResource> => {
      return this.request<BusinessResource>('/resources', {
        method: 'POST',
        body: JSON.stringify(resource),
      })
    },

    get: async (type: string, id: string): Promise<BusinessResource> => {
      return this.request<BusinessResource>(`/resources/${type}/${id}`)
    },

    update: async (resource: BusinessResource): Promise<BusinessResource> => {
      return this.request<BusinessResource>(`/resources/${resource.$type}/${resource.$id}`, {
        method: 'PUT',
        body: JSON.stringify(resource),
      })
    },

    delete: async (type: string, id: string): Promise<void> => {
      return this.request<void>(`/resources/${type}/${id}`, {
        method: 'DELETE',
      })
    },

    list: async (type: string): Promise<BusinessResource[]> => {
      return this.request<BusinessResource[]>(`/resources/${type}`)
    },
  }

  /**
   * Actions API (verbs)
   */
  actions = {
    execute: async (action: Omit<BusinessAction, 'id'>): Promise<BusinessAction> => {
      return this.request<BusinessAction>('/actions/execute', {
        method: 'POST',
        body: JSON.stringify(action),
      })
    },

    list: async (): Promise<BusinessAction[]> => {
      return this.request<BusinessAction[]>('/actions')
    },

    get: async (id: string): Promise<BusinessAction> => {
      return this.request<BusinessAction>(`/actions/${id}`)
    },
  }

  /**
   * Events API
   */
  events = {
    publish: async (event: Omit<BusinessEvent, 'id'>): Promise<BusinessEvent> => {
      return this.request<BusinessEvent>('/events', {
        method: 'POST',
        body: JSON.stringify(event),
      })
    },

    list: async (filters?: Record<string, any>): Promise<BusinessEvent[]> => {
      const query = new URLSearchParams(filters).toString()
      return this.request<BusinessEvent[]>(`/events${query ? `?${query}` : ''}`)
    },

    get: async (id: string): Promise<BusinessEvent> => {
      return this.request<BusinessEvent>(`/events/${id}`)
    },
  }

  /**
   * Searches API
   */
  searches = {
    query: async (query: BusinessQuery): Promise<BusinessResource[]> => {
      return this.request<BusinessResource[]>('/searches/query', {
        method: 'POST',
        body: JSON.stringify(query),
      })
    },

    vector: async (embedding: number[], filters?: Record<string, any>): Promise<BusinessResource[]> => {
      return this.request<BusinessResource[]>('/searches/vector', {
        method: 'POST',
        body: JSON.stringify({ embedding, filters }),
      })
    },
  }

  /**
   * Metrics API (KPIs/OKRs)
   */
  metrics = {
    record: async (metric: Omit<BusinessMetric, 'id'>): Promise<BusinessMetric> => {
      return this.request<BusinessMetric>('/metrics', {
        method: 'POST',
        body: JSON.stringify(metric),
      })
    },

    list: async (): Promise<BusinessMetric[]> => {
      return this.request<BusinessMetric[]>('/metrics')
    },

    get: async (id: string): Promise<BusinessMetric> => {
      return this.request<BusinessMetric>(`/metrics/${id}`)
    },
  }
}

/**
 * Create a new Business API client
 */
export function createBusinessApi(config?: ApiConfig): BusinessApi {
  return new BusinessApi(config)
}

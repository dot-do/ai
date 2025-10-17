/**
 * database.do SDK - Tenant-specific ACID-compliant database
 *
 * This SDK provides a type-safe client for interacting with database.do,
 * which uses Cloudflare Durable Objects with Payload CMS SQLite adapter
 * for tenant-isolated, strongly consistent database operations.
 */

export interface DatabaseClientConfig {
  baseUrl?: string
  timeout?: number
  headers?: Record<string, string>
}

export interface Collection {
  id: string
  name: string
  schema?: CollectionSchema
  createdAt: string
  updatedAt: string
}

export interface CollectionSchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array'
    required?: boolean
    unique?: boolean
    index?: boolean
  }
}

export interface QueryOptions {
  limit?: number
  offset?: number
  sort?: Record<string, 'asc' | 'desc'>
  filter?: Record<string, any>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export interface Transaction {
  get<T = any>(collection: string, id: string): Promise<T | null>
  list<T = any>(collection: string, options?: QueryOptions): Promise<PaginatedResponse<T>>
  create<T = any>(collection: string, data: any): Promise<T>
  update<T = any>(collection: string, id: string, data: any): Promise<T>
  delete(collection: string, id: string): Promise<void>
  commit(): Promise<void>
  rollback(): Promise<void>
}

export interface BatchResult<T> {
  success: T[]
  errors: Array<{ index: number; error: string }>
}

export class DatabaseClient {
  private baseUrl: string
  private timeout: number
  private headers: Record<string, string>

  constructor(config: DatabaseClientConfig = {}) {
    this.baseUrl = config.baseUrl || 'https://database.do'
    this.timeout = config.timeout || 10000
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    }
  }

  /**
   * Get a single document by ID
   */
  async get<T = any>(collection: string, id: string): Promise<T | null> {
    const response = await this.fetch(`/collections/${collection}/${id}`)
    if (response.status === 404) return null
    return response.json()
  }

  /**
   * List documents in a collection with pagination and filtering
   */
  async list<T = any>(collection: string, options: QueryOptions = {}): Promise<PaginatedResponse<T>> {
    const params = new URLSearchParams()
    if (options.limit) params.set('limit', String(options.limit))
    if (options.offset) params.set('offset', String(options.offset))
    if (options.sort) params.set('sort', JSON.stringify(options.sort))
    if (options.filter) params.set('filter', JSON.stringify(options.filter))

    const url = `/collections/${collection}?${params}`
    const response = await this.fetch(url)
    return response.json()
  }

  /**
   * Create a new document
   */
  async create<T = any>(collection: string, data: any): Promise<T> {
    const response = await this.fetch(`/collections/${collection}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.json()
  }

  /**
   * Update an existing document
   */
  async update<T = any>(collection: string, id: string, data: any): Promise<T> {
    const response = await this.fetch(`/collections/${collection}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    return response.json()
  }

  /**
   * Delete a document
   */
  async delete(collection: string, id: string): Promise<void> {
    await this.fetch(`/collections/${collection}/${id}`, {
      method: 'DELETE',
    })
  }

  /**
   * Batch create multiple documents
   */
  async batchCreate<T = any>(collection: string, documents: any[]): Promise<BatchResult<T>> {
    const response = await this.fetch(`/collections/${collection}/batch`, {
      method: 'POST',
      body: JSON.stringify({ documents }),
    })
    return response.json()
  }

  /**
   * Batch update multiple documents
   */
  async batchUpdate<T = any>(collection: string, updates: Array<{ id: string; data: any }>): Promise<BatchResult<T>> {
    const response = await this.fetch(`/collections/${collection}/batch`, {
      method: 'PATCH',
      body: JSON.stringify({ updates }),
    })
    return response.json()
  }

  /**
   * Batch delete multiple documents
   */
  async batchDelete(collection: string, ids: string[]): Promise<void> {
    await this.fetch(`/collections/${collection}/batch`, {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    })
  }

  /**
   * Execute a transaction
   */
  async transaction<T = void>(fn: (tx: Transaction) => Promise<T>): Promise<T> {
    // Start transaction
    const startResponse = await this.fetch('/transactions', {
      method: 'POST',
    })

    const { transactionId } = (await startResponse.json()) as { transactionId: string }

    // Create transaction object
    const tx: Transaction = {
      get: async <T = any>(collection: string, id: string): Promise<T | null> => {
        return this.get<T>(collection, id)
      },
      list: async <T = any>(collection: string, options?: QueryOptions): Promise<PaginatedResponse<T>> => {
        return this.list<T>(collection, options)
      },
      create: async <T = any>(collection: string, data: any): Promise<T> => {
        return this.create<T>(collection, data)
      },
      update: async <T = any>(collection: string, id: string, data: any): Promise<T> => {
        return this.update<T>(collection, id, data)
      },
      delete: async (collection: string, id: string): Promise<void> => {
        return this.delete(collection, id)
      },
      commit: async (): Promise<void> => {
        await this.fetch(`/transactions/${transactionId}/commit`, {
          method: 'POST',
        })
      },
      rollback: async (): Promise<void> => {
        await this.fetch(`/transactions/${transactionId}/rollback`, {
          method: 'POST',
        })
      },
    }

    try {
      const result = await fn(tx)
      await tx.commit()
      return result
    } catch (error) {
      await tx.rollback()
      throw error
    }
  }

  /**
   * List all collections
   */
  async collections(): Promise<Collection[]> {
    const response = await this.fetch('/collections')
    return response.json()
  }

  /**
   * Create a new collection
   */
  async createCollection(name: string, schema?: CollectionSchema): Promise<Collection> {
    const response = await this.fetch('/collections', {
      method: 'POST',
      body: JSON.stringify({ name, schema }),
    })
    return response.json()
  }

  /**
   * Delete a collection
   */
  async deleteCollection(name: string): Promise<void> {
    await this.fetch(`/collections/${name}`, {
      method: 'DELETE',
    })
  }

  /**
   * Get health status
   */
  async health(): Promise<{ status: string; timestamp: number }> {
    const response = await this.fetch('/health')
    return response.json()
  }

  /**
   * Internal fetch wrapper with timeout and error handling
   */
  private async fetch(path: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
        signal: controller.signal,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }))
        throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      return response
    } finally {
      clearTimeout(timeoutId)
    }
  }
}

/**
 * Create a database client
 */
export function createClient(config?: DatabaseClientConfig): DatabaseClient {
  return new DatabaseClient(config)
}

// Re-export types
export type { DatabaseClientConfig, Collection, CollectionSchema, QueryOptions, PaginatedResponse, Transaction, BatchResult }

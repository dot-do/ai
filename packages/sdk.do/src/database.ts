/**
 * Database Service for sdk.do
 *
 * Provides semantic database operations with full CRUD, relationships,
 * search, batch operations, transactions, and schema management.
 *
 * Features:
 * - Full CRUD operations (create, read, update, delete)
 * - Semantic query support using graphdl patterns
 * - Collection management (list, create, delete)
 * - Relationships and graph queries
 * - Batch operations (bulk create, update, delete)
 * - Pagination (cursor-based and offset-based)
 * - Search (vector and full-text)
 * - Transactions and atomic operations
 * - Schema validation
 * - Migration support
 *
 * @example
 * ```typescript
 * import { $, db } from 'sdk.do'
 *
 * // Basic CRUD
 * const user = await db.get('users', 'user-123')
 * const users = await db.list('users', { limit: 10, offset: 0 })
 * const created = await db.create('users', { name: 'Alice', email: 'alice@example.com' })
 * const updated = await db.update('users', 'user-123', { name: 'Alice Smith' })
 * await db.delete('users', 'user-123')
 *
 * // Search
 * const results = await db.search('users', 'alice', { fuzzy: true, limit: 10 })
 *
 * // Relationships
 * await db.relate('users', 'user-123', 'organizations', 'org-456', { role: 'admin' })
 * const orgs = await db.getRelated('users', 'user-123', 'organizations')
 *
 * // Batch operations
 * const users = await db.batchCreate('users', [
 *   { name: 'Alice' },
 *   { name: 'Bob' }
 * ])
 *
 * // Transactions
 * await db.transaction(async (tx) => {
 *   const user = await tx.create('users', { name: 'Alice' })
 *   await tx.create('profiles', { userId: user.id, bio: '...' })
 * })
 *
 * // Collections
 * const collections = await db.collections()
 * await db.createCollection('products', { schema: {...} })
 * ```
 */

import type { BusinessContext, PaginatedResponse } from './types'

/**
 * Query options for list operations
 */
export interface QueryOptions {
  /** Maximum number of items to return */
  limit?: number
  /** Number of items to skip (offset-based pagination) */
  offset?: number
  /** Cursor for cursor-based pagination */
  cursor?: string
  /** Sort field */
  sortBy?: string
  /** Sort order */
  sortOrder?: 'asc' | 'desc'
  /** Filter conditions */
  where?: Record<string, any>
  /** Fields to include in results */
  select?: string[]
  /** Fields to exclude from results */
  exclude?: string[]
}

/**
 * Search options
 */
export interface SearchOptions extends QueryOptions {
  /** Enable fuzzy matching */
  fuzzy?: boolean
  /** Use vector search */
  vector?: boolean
  /** Minimum similarity score (0-1) for vector search */
  minScore?: number
  /** Search fields */
  fields?: string[]
}

/**
 * Relationship options
 */
export interface RelationshipOptions {
  /** Relationship metadata */
  metadata?: Record<string, any>
  /** Relationship type/label */
  type?: string
  /** Bidirectional relationship */
  bidirectional?: boolean
}

/**
 * Collection schema definition
 */
export interface CollectionSchema {
  /** Collection name */
  name: string
  /** Field definitions */
  fields?: Record<string, FieldSchema>
  /** Indexes */
  indexes?: IndexSchema[]
  /** Relationships */
  relationships?: RelationshipSchema[]
  /** Validation rules */
  validation?: ValidationRule[]
  /** Collection metadata */
  metadata?: Record<string, any>
}

/**
 * Field schema definition
 */
export interface FieldSchema {
  /** Field type */
  type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array' | 'reference'
  /** Is required */
  required?: boolean
  /** Default value */
  default?: any
  /** Unique constraint */
  unique?: boolean
  /** Field validation */
  validation?: ValidationRule[]
  /** Field metadata */
  metadata?: Record<string, any>
}

/**
 * Index schema definition
 */
export interface IndexSchema {
  /** Index name */
  name: string
  /** Indexed fields */
  fields: string[]
  /** Unique index */
  unique?: boolean
  /** Index type */
  type?: 'btree' | 'hash' | 'vector' | 'fulltext'
}

/**
 * Relationship schema definition
 */
export interface RelationshipSchema {
  /** Relationship name */
  name: string
  /** Target collection */
  target: string
  /** Relationship type */
  type: 'one-to-one' | 'one-to-many' | 'many-to-many'
  /** Foreign key field */
  foreignKey?: string
  /** Cascade delete */
  cascadeDelete?: boolean
}

/**
 * Validation rule
 */
export interface ValidationRule {
  /** Rule type */
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom'
  /** Rule value */
  value?: any
  /** Error message */
  message?: string
  /** Custom validator function (serialized) */
  validator?: string
}

/**
 * Collection metadata
 */
export interface Collection {
  /** Collection name */
  name: string
  /** Number of documents */
  count: number
  /** Schema definition */
  schema?: CollectionSchema
  /** Created timestamp */
  createdAt: string
  /** Updated timestamp */
  updatedAt: string
}

/**
 * Transaction interface
 */
export interface Transaction {
  /** Create a document */
  create<T = any>(collection: string, data: any): Promise<T>
  /** Update a document */
  update<T = any>(collection: string, id: string, data: any): Promise<T>
  /** Delete a document */
  delete(collection: string, id: string): Promise<void>
  /** Get a document */
  get<T = any>(collection: string, id: string): Promise<T | null>
  /** List documents */
  list<T = any>(collection: string, options?: QueryOptions): Promise<T[]>
  /** Commit transaction */
  commit(): Promise<void>
  /** Rollback transaction */
  rollback(): Promise<void>
}

/**
 * Migration definition
 */
export interface Migration {
  /** Migration version */
  version: string
  /** Migration name */
  name: string
  /** Up migration function */
  up: (db: DatabaseService) => Promise<void>
  /** Down migration function */
  down: (db: DatabaseService) => Promise<void>
}

/**
 * Database service configuration
 */
export interface DatabaseServiceConfig {
  /** API URL */
  apiUrl?: string
  /** API key */
  apiKey?: string
  /** Default collection prefix */
  collectionPrefix?: string
  /** Enable caching */
  cache?: boolean
  /** Cache TTL in seconds */
  cacheTTL?: number
}

/**
 * Batch operation result
 */
export interface BatchResult<T = any> {
  /** Successfully processed items */
  success: T[]
  /** Failed items with errors */
  failed: Array<{
    item: any
    error: string
  }>
  /** Total items processed */
  total: number
}

/**
 * Database Service class
 *
 * Provides comprehensive database operations for the .do platform
 */
export class DatabaseService {
  private apiUrl: string
  private headers: Record<string, string>
  private config: DatabaseServiceConfig

  constructor(
    private client: BusinessContext,
    config: DatabaseServiceConfig = {}
  ) {
    this.config = config
    this.apiUrl = config.apiUrl || 'https://database.do'
    this.headers = {
      'Content-Type': 'application/json',
    }

    if (config.apiKey) {
      this.headers['Authorization'] = `Bearer ${config.apiKey}`
    }
  }

  /**
   * Get a single document by ID
   *
   * @example
   * ```typescript
   * const user = await db.get('users', 'user-123')
   * console.log(user.name)
   * ```
   */
  async get<T = any>(collection: string, id: string): Promise<T | null> {
    const response = await fetch(`${this.apiUrl}/${collection}/${id}`, {
      method: 'GET',
      headers: this.headers,
    })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new Error(`Failed to get document: ${response.statusText}`)
    }

    const data = await response.json()
    return data.document as T
  }

  /**
   * List documents in a collection
   *
   * @example
   * ```typescript
   * const users = await db.list('users', {
   *   limit: 10,
   *   offset: 0,
   *   sortBy: 'createdAt',
   *   sortOrder: 'desc',
   *   where: { status: 'active' }
   * })
   * ```
   */
  async list<T = any>(collection: string, options: QueryOptions = {}): Promise<PaginatedResponse<T>> {
    const params = new URLSearchParams()

    if (options.limit) params.set('limit', options.limit.toString())
    if (options.offset) params.set('offset', options.offset.toString())
    if (options.cursor) params.set('cursor', options.cursor)
    if (options.sortBy) params.set('sortBy', options.sortBy)
    if (options.sortOrder) params.set('sortOrder', options.sortOrder)
    if (options.where) params.set('where', JSON.stringify(options.where))
    if (options.select) params.set('select', options.select.join(','))
    if (options.exclude) params.set('exclude', options.exclude.join(','))

    const url = `${this.apiUrl}/${collection}?${params}`
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to list documents: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      items: data.documents as T[],
      total: data.total,
      hasMore: data.hasMore,
      limit: options.limit,
      offset: options.offset,
    }
  }

  /**
   * Create a new document
   *
   * @example
   * ```typescript
   * const user = await db.create('users', {
   *   name: 'Alice',
   *   email: 'alice@example.com',
   *   role: 'admin'
   * })
   * console.log(user.id)
   * ```
   */
  async create<T = any>(collection: string, data: any): Promise<T> {
    const response = await fetch(`${this.apiUrl}/${collection}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ data }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(`Failed to create document: ${error.message || response.statusText}`)
    }

    const result = await response.json()
    return result.document as T
  }

  /**
   * Update an existing document
   *
   * @example
   * ```typescript
   * const user = await db.update('users', 'user-123', {
   *   name: 'Alice Smith',
   *   updatedAt: new Date().toISOString()
   * })
   * ```
   */
  async update<T = any>(collection: string, id: string, data: any): Promise<T> {
    const response = await fetch(`${this.apiUrl}/${collection}/${id}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({ data }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(`Failed to update document: ${error.message || response.statusText}`)
    }

    const result = await response.json()
    return result.document as T
  }

  /**
   * Delete a document
   *
   * @example
   * ```typescript
   * await db.delete('users', 'user-123')
   * ```
   */
  async delete(collection: string, id: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/${collection}/${id}`, {
      method: 'DELETE',
      headers: this.headers,
    })

    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to delete document: ${response.statusText}`)
    }
  }

  /**
   * Search documents in a collection
   *
   * @example
   * ```typescript
   * const results = await db.search('users', 'alice', {
   *   fuzzy: true,
   *   limit: 10,
   *   fields: ['name', 'email']
   * })
   * ```
   */
  async search<T = any>(collection: string, query: string, options: SearchOptions = {}): Promise<PaginatedResponse<T>> {
    const params = new URLSearchParams()

    params.set('q', query)
    if (options.limit) params.set('limit', options.limit.toString())
    if (options.offset) params.set('offset', options.offset.toString())
    if (options.fuzzy) params.set('fuzzy', 'true')
    if (options.vector) params.set('vector', 'true')
    if (options.minScore) params.set('minScore', options.minScore.toString())
    if (options.fields) params.set('fields', options.fields.join(','))

    const url = `${this.apiUrl}/${collection}/search?${params}`
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to search documents: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      items: data.results as T[],
      total: data.total,
      hasMore: data.hasMore,
      limit: options.limit,
      offset: options.offset,
    }
  }

  /**
   * Create a relationship between two documents
   *
   * @example
   * ```typescript
   * await db.relate('users', 'user-123', 'organizations', 'org-456', {
   *   metadata: { role: 'admin', joinedAt: new Date().toISOString() }
   * })
   * ```
   */
  async relate(fromCollection: string, fromId: string, toCollection: string, toId: string, options: RelationshipOptions = {}): Promise<void> {
    const response = await fetch(`${this.apiUrl}/${fromCollection}/${fromId}/relationships`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        toCollection,
        toId,
        metadata: options.metadata,
        type: options.type,
        bidirectional: options.bidirectional,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create relationship: ${response.statusText}`)
    }
  }

  /**
   * Get related documents
   *
   * @example
   * ```typescript
   * const orgs = await db.getRelated('users', 'user-123', 'organizations', {
   *   limit: 10
   * })
   * ```
   */
  async getRelated<T = any>(fromCollection: string, fromId: string, toCollection: string, options: QueryOptions = {}): Promise<PaginatedResponse<T>> {
    const params = new URLSearchParams()

    if (options.limit) params.set('limit', options.limit.toString())
    if (options.offset) params.set('offset', options.offset.toString())

    const url = `${this.apiUrl}/${fromCollection}/${fromId}/relationships/${toCollection}?${params}`
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to get related documents: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      items: data.documents as T[],
      total: data.total,
      hasMore: data.hasMore,
      limit: options.limit,
      offset: options.offset,
    }
  }

  /**
   * Remove a relationship
   *
   * @example
   * ```typescript
   * await db.unrelate('users', 'user-123', 'organizations', 'org-456')
   * ```
   */
  async unrelate(fromCollection: string, fromId: string, toCollection: string, toId: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/${fromCollection}/${fromId}/relationships/${toCollection}/${toId}`, {
      method: 'DELETE',
      headers: this.headers,
    })

    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to remove relationship: ${response.statusText}`)
    }
  }

  /**
   * Batch create documents
   *
   * @example
   * ```typescript
   * const result = await db.batchCreate('users', [
   *   { name: 'Alice', email: 'alice@example.com' },
   *   { name: 'Bob', email: 'bob@example.com' }
   * ])
   * console.log(result.success.length, 'created')
   * ```
   */
  async batchCreate<T = any>(collection: string, documents: any[]): Promise<BatchResult<T>> {
    const response = await fetch(`${this.apiUrl}/${collection}/batch`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ documents }),
    })

    if (!response.ok) {
      throw new Error(`Failed to batch create documents: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      success: data.success as T[],
      failed: data.failed || [],
      total: documents.length,
    }
  }

  /**
   * Batch update documents
   *
   * @example
   * ```typescript
   * const result = await db.batchUpdate('users', [
   *   { id: 'user-123', data: { name: 'Alice Smith' } },
   *   { id: 'user-456', data: { name: 'Bob Jones' } }
   * ])
   * ```
   */
  async batchUpdate<T = any>(collection: string, updates: Array<{ id: string; data: any }>): Promise<BatchResult<T>> {
    const response = await fetch(`${this.apiUrl}/${collection}/batch`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({ updates }),
    })

    if (!response.ok) {
      throw new Error(`Failed to batch update documents: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      success: data.success as T[],
      failed: data.failed || [],
      total: updates.length,
    }
  }

  /**
   * Batch delete documents
   *
   * @example
   * ```typescript
   * const result = await db.batchDelete('users', ['user-123', 'user-456'])
   * ```
   */
  async batchDelete(collection: string, ids: string[]): Promise<BatchResult<string>> {
    const response = await fetch(`${this.apiUrl}/${collection}/batch`, {
      method: 'DELETE',
      headers: this.headers,
      body: JSON.stringify({ ids }),
    })

    if (!response.ok) {
      throw new Error(`Failed to batch delete documents: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      success: data.success as string[],
      failed: data.failed || [],
      total: ids.length,
    }
  }

  /**
   * Execute a transaction
   *
   * @example
   * ```typescript
   * await db.transaction(async (tx) => {
   *   const user = await tx.create('users', { name: 'Alice' })
   *   await tx.create('profiles', { userId: user.id, bio: 'Software engineer' })
   * })
   * ```
   */
  async transaction<T = void>(fn: (tx: Transaction) => Promise<T>): Promise<T> {
    // Start transaction
    const startResponse = await fetch(`${this.apiUrl}/transactions`, {
      method: 'POST',
      headers: this.headers,
    })

    if (!startResponse.ok) {
      throw new Error(`Failed to start transaction: ${startResponse.statusText}`)
    }

    const { transactionId } = (await startResponse.json()) as { transactionId: string }

    // Create transaction object
    const tx: Transaction = {
      create: async (collection, data) => {
        const response = await fetch(`${this.apiUrl}/${collection}?transactionId=${transactionId}`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({ data }),
        })

        if (!response.ok) {
          throw new Error(`Transaction create failed: ${response.statusText}`)
        }

        const result = await response.json()
        return result.document
      },

      update: async (collection, id, data) => {
        const response = await fetch(`${this.apiUrl}/${collection}/${id}?transactionId=${transactionId}`, {
          method: 'PATCH',
          headers: this.headers,
          body: JSON.stringify({ data }),
        })

        if (!response.ok) {
          throw new Error(`Transaction update failed: ${response.statusText}`)
        }

        const result = await response.json()
        return result.document
      },

      delete: async (collection, id) => {
        const response = await fetch(`${this.apiUrl}/${collection}/${id}?transactionId=${transactionId}`, {
          method: 'DELETE',
          headers: this.headers,
        })

        if (!response.ok) {
          throw new Error(`Transaction delete failed: ${response.statusText}`)
        }
      },

      get: async (collection, id) => {
        const response = await fetch(`${this.apiUrl}/${collection}/${id}?transactionId=${transactionId}`, {
          method: 'GET',
          headers: this.headers,
        })

        if (response.status === 404) {
          return null
        }

        if (!response.ok) {
          throw new Error(`Transaction get failed: ${response.statusText}`)
        }

        const result = await response.json()
        return result.document
      },

      list: async (collection, options = {}) => {
        const params = new URLSearchParams({ transactionId })
        if (options.limit) params.set('limit', options.limit.toString())
        if (options.offset) params.set('offset', options.offset.toString())

        const response = await fetch(`${this.apiUrl}/${collection}?${params}`, {
          method: 'GET',
          headers: this.headers,
        })

        if (!response.ok) {
          throw new Error(`Transaction list failed: ${response.statusText}`)
        }

        const result = await response.json()
        return result.documents
      },

      commit: async () => {
        const response = await fetch(`${this.apiUrl}/transactions/${transactionId}/commit`, {
          method: 'POST',
          headers: this.headers,
        })

        if (!response.ok) {
          throw new Error(`Transaction commit failed: ${response.statusText}`)
        }
      },

      rollback: async () => {
        const response = await fetch(`${this.apiUrl}/transactions/${transactionId}/rollback`, {
          method: 'POST',
          headers: this.headers,
        })

        if (!response.ok) {
          throw new Error(`Transaction rollback failed: ${response.statusText}`)
        }
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
   *
   * @example
   * ```typescript
   * const collections = await db.collections()
   * console.log(collections.map(c => c.name))
   * ```
   */
  async collections(): Promise<Collection[]> {
    const response = await fetch(`${this.apiUrl}/collections`, {
      method: 'GET',
      headers: this.headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to list collections: ${response.statusText}`)
    }

    const data = await response.json()
    return data.collections as Collection[]
  }

  /**
   * Create a new collection
   *
   * @example
   * ```typescript
   * await db.createCollection('products', {
   *   name: 'products',
   *   fields: {
   *     name: { type: 'string', required: true },
   *     price: { type: 'number', required: true },
   *     inStock: { type: 'boolean', default: true }
   *   },
   *   indexes: [
   *     { name: 'name_idx', fields: ['name'], type: 'btree' }
   *   ]
   * })
   * ```
   */
  async createCollection(name: string, schema?: CollectionSchema): Promise<Collection> {
    const response = await fetch(`${this.apiUrl}/collections`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ name, schema }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(`Failed to create collection: ${error.message || response.statusText}`)
    }

    const data = await response.json()
    return data.collection as Collection
  }

  /**
   * Delete a collection
   *
   * @example
   * ```typescript
   * await db.deleteCollection('products')
   * ```
   */
  async deleteCollection(name: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/collections/${name}`, {
      method: 'DELETE',
      headers: this.headers,
    })

    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to delete collection: ${response.statusText}`)
    }
  }

  /**
   * Get collection schema
   *
   * @example
   * ```typescript
   * const schema = await db.getSchema('products')
   * console.log(schema.fields)
   * ```
   */
  async getSchema(collection: string): Promise<CollectionSchema | null> {
    const response = await fetch(`${this.apiUrl}/collections/${collection}/schema`, {
      method: 'GET',
      headers: this.headers,
    })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new Error(`Failed to get schema: ${response.statusText}`)
    }

    const data = await response.json()
    return data.schema as CollectionSchema
  }

  /**
   * Update collection schema
   *
   * @example
   * ```typescript
   * await db.updateSchema('products', {
   *   fields: {
   *     ...existingFields,
   *     description: { type: 'string' }
   *   }
   * })
   * ```
   */
  async updateSchema(collection: string, schema: Partial<CollectionSchema>): Promise<void> {
    const response = await fetch(`${this.apiUrl}/collections/${collection}/schema`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({ schema }),
    })

    if (!response.ok) {
      throw new Error(`Failed to update schema: ${response.statusText}`)
    }
  }

  /**
   * Run migrations
   *
   * @example
   * ```typescript
   * await db.migrate([
   *   {
   *     version: '1.0.0',
   *     name: 'add-products-collection',
   *     up: async (db) => {
   *       await db.createCollection('products', {...})
   *     },
   *     down: async (db) => {
   *       await db.deleteCollection('products')
   *     }
   *   }
   * ])
   * ```
   */
  async migrate(migrations: Migration[]): Promise<void> {
    for (const migration of migrations) {
      try {
        await migration.up(this)
      } catch (error) {
        console.error(`Migration ${migration.version} failed:`, error)
        throw error
      }
    }
  }

  /**
   * Validate document against schema
   *
   * @example
   * ```typescript
   * const valid = await db.validate('products', {
   *   name: 'Widget',
   *   price: 9.99
   * })
   * ```
   */
  async validate(collection: string, data: any): Promise<{ valid: boolean; errors?: string[] }> {
    const response = await fetch(`${this.apiUrl}/collections/${collection}/validate`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ data }),
    })

    if (!response.ok) {
      throw new Error(`Failed to validate document: ${response.statusText}`)
    }

    return response.json() as Promise<{ valid: boolean; errors?: string[] }>
  }

  /**
   * Count documents in a collection
   *
   * @example
   * ```typescript
   * const count = await db.count('users', { where: { status: 'active' } })
   * ```
   */
  async count(collection: string, options: Pick<QueryOptions, 'where'> = {}): Promise<number> {
    const params = new URLSearchParams()
    if (options.where) params.set('where', JSON.stringify(options.where))

    const url = `${this.apiUrl}/${collection}/count?${params}`
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to count documents: ${response.statusText}`)
    }

    const data = await response.json()
    return data.count as number
  }

  /**
   * Check if a document exists
   *
   * @example
   * ```typescript
   * const exists = await db.exists('users', 'user-123')
   * ```
   */
  async exists(collection: string, id: string): Promise<boolean> {
    const response = await fetch(`${this.apiUrl}/${collection}/${id}/exists`, {
      method: 'HEAD',
      headers: this.headers,
    })

    return response.ok
  }
}

/**
 * Create a DatabaseService instance
 */
export function createDatabaseService(client: BusinessContext, config?: DatabaseServiceConfig): DatabaseService {
  return new DatabaseService(client, config)
}

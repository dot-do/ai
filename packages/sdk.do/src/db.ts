/**
 * Database Service for SDK.do
 *
 * Provides methods for tenant-specific database operations using Durable Objects with SQLite.
 * Supports CRUD, batch operations, relationships, cursor pagination, and MongoDB-style queries.
 *
 * @example
 * ```typescript
 * import { $ } from 'sdk.do'
 *
 * // Create a document
 * const user = await $.db.create('users', 'user_123', 'User', {
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * })
 *
 * // Query with MongoDB-style syntax
 * const activeUsers = await $.db.search('users', {
 *   status: { $eq: 'active' },
 *   age: { $gte: 18 }
 * })
 *
 * // Create relationships
 * await $.db.relate('users', 'user_123', 'orders', 'order_456', 'placed')
 * ```
 */

// ============================================================================
// TYPES - Layer 3 Integration (workers/database)
// ============================================================================

export interface QueryOptions {
  /**
   * SQL query string
   */
  sql: string

  /**
   * Query parameters (parameterized queries)
   */
  params?: any[]

  /**
   * Maximum rows to return
   */
  maxRows?: number
}

export interface QueryResult<T = any> {
  /**
   * Query result rows
   */
  rows: T[]

  /**
   * Row count
   */
  rowCount: number

  /**
   * Field names
   */
  fields: string[]

  /**
   * Execution time (ms)
   */
  executionTime?: number
}

export interface TransactionOptions {
  /**
   * Transaction queries
   */
  queries: Array<{
    sql: string
    params?: any[]
  }>

  /**
   * Isolation level
   */
  isolationLevel?: 'read uncommitted' | 'read committed' | 'repeatable read' | 'serializable'
}

export interface TransactionResult {
  /**
   * Transaction results
   */
  results: QueryResult[]

  /**
   * Success flag
   */
  success: boolean

  /**
   * Error message (if failed)
   */
  error?: string

  /**
   * Execution time (ms)
   */
  executionTime?: number
}

export interface BatchQueryOptions {
  /**
   * Batch of queries to execute
   */
  queries: Array<{
    sql: string
    params?: any[]
  }>

  /**
   * Continue on error
   */
  continueOnError?: boolean
}

export interface BatchQueryResult {
  /**
   * Individual query results
   */
  results: Array<QueryResult | { error: string }>

  /**
   * Success count
   */
  successCount: number

  /**
   * Failure count
   */
  failureCount: number

  /**
   * Execution time (ms)
   */
  executionTime?: number
}

export interface SchemaInfo {
  /**
   * Tables in the database
   */
  tables: Array<{
    name: string
    schema: string
    columns: Array<{
      name: string
      type: string
      nullable: boolean
      default?: string
    }>
  }>
}

// ============================================================================
// TYPES
// ============================================================================

export interface Document<T = Record<string, any>> {
  /**
   * Document ID
   */
  id: string

  /**
   * Namespace (collection name)
   */
  namespace: string

  /**
   * Document type (optional)
   */
  type?: string

  /**
   * Document data
   */
  data: T

  /**
   * Created timestamp (ISO 8601)
   */
  createdAt: string

  /**
   * Updated timestamp (ISO 8601)
   */
  updatedAt: string

  /**
   * Deleted timestamp (ISO 8601) - soft delete
   */
  deletedAt?: string
}

export interface ListOptions {
  /**
   * Namespace (collection) to list from
   */
  namespace?: string

  /**
   * Filter by type
   */
  type?: string

  /**
   * Maximum results to return
   */
  limit?: number

  /**
   * Pagination offset
   */
  offset?: number

  /**
   * Sort field
   */
  sort?: string

  /**
   * Sort order
   */
  order?: 'asc' | 'desc'

  /**
   * Fields to include in response
   */
  fields?: string[]
}

export interface ListResponse<T = Record<string, any>> {
  /**
   * Documents
   */
  documents: Document<T>[]

  /**
   * Total count (without limit/offset)
   */
  total: number
}

export interface QueryFilter {
  /**
   * Equals
   */
  $eq?: any

  /**
   * Not equals
   */
  $ne?: any

  /**
   * Greater than
   */
  $gt?: any

  /**
   * Greater than or equal
   */
  $gte?: any

  /**
   * Less than
   */
  $lt?: any

  /**
   * Less than or equal
   */
  $lte?: any

  /**
   * In array
   */
  $in?: any[]

  /**
   * Not in array
   */
  $nin?: any[]

  /**
   * Field exists
   */
  $exists?: boolean

  /**
   * Contains (LIKE pattern)
   */
  $contains?: string
}

export type MongoQuery = {
  [key: string]: any | QueryFilter
}

export interface SearchOptions {
  /**
   * Namespace (collection) to search
   */
  namespace?: string

  /**
   * Filter by type
   */
  type?: string

  /**
   * Maximum results to return
   */
  limit?: number

  /**
   * Pagination offset
   */
  offset?: number

  /**
   * Fields to include in response
   */
  fields?: string[]
}

export interface SearchResponse<T = Record<string, any>> {
  /**
   * Documents matching query
   */
  documents: Document<T>[]

  /**
   * Total count (without limit/offset)
   */
  total: number
}

export interface CursorPageRequest {
  /**
   * Namespace (collection) to paginate
   */
  namespace?: string

  /**
   * Filter by type
   */
  type?: string

  /**
   * Page size
   */
  limit?: number

  /**
   * Cursor token for next page
   */
  cursor?: string

  /**
   * Sort field
   */
  sort?: string

  /**
   * Sort order
   */
  order?: 'asc' | 'desc'

  /**
   * Fields to include in response
   */
  fields?: string[]
}

export interface CursorPageResponse<T = Record<string, any>> {
  /**
   * Documents
   */
  documents: Document<T>[]

  /**
   * Next page cursor token
   */
  nextCursor?: string

  /**
   * Whether there are more results
   */
  hasMore: boolean

  /**
   * Total count (approximate)
   */
  total?: number
}

export interface BatchCreateRequest<T = Record<string, any>> {
  /**
   * Namespace (collection)
   */
  namespace: string

  /**
   * Documents to create
   */
  documents: Array<{
    id: string
    type?: string
    data: T
  }>
}

export interface BatchUpdateRequest<T = Record<string, any>> {
  /**
   * Namespace (collection)
   */
  namespace: string

  /**
   * Document updates
   */
  updates: Array<{
    id: string
    data: Partial<T>
  }>
}

export interface BatchDeleteRequest {
  /**
   * Namespace (collection)
   */
  namespace: string

  /**
   * Document IDs to delete
   */
  ids: string[]

  /**
   * Hard delete (permanent)
   */
  hard?: boolean
}

export interface BatchResult<T = any> {
  /**
   * Successful operations
   */
  successful: T[]

  /**
   * Failed operations
   */
  failed: Array<{
    id: string
    error: string
  }>

  /**
   * Success count
   */
  successCount: number

  /**
   * Failure count
   */
  failureCount: number
}

export interface ForEachOptions {
  /**
   * Batch size for processing documents
   * @default 100
   */
  batchSize?: number

  /**
   * Concurrency limit for parallel batch processing (sync mode only)
   * @default 5
   */
  concurrency?: number

  /**
   * Use Cloudflare Queues for background processing
   * @default true
   */
  useQueue?: boolean

  /**
   * Queue name for background processing
   * @default 'db-foreach'
   */
  queueName?: string

  /**
   * Continue processing on error
   * @default false
   */
  continueOnError?: boolean

  /**
   * Progress callback
   */
  onProgress?: (processed: number, total: number) => void

  /**
   * Error callback
   */
  onError?: (error: Error, document: Document) => void
}

export interface ForEachResult {
  /**
   * Total documents processed
   */
  processed: number

  /**
   * Successfully processed count
   */
  success: number

  /**
   * Failed count
   */
  failed: number

  /**
   * Job ID (if using queue)
   */
  jobId?: string

  /**
   * Error details
   */
  errors: Array<{
    documentId: string
    error: string
  }>
}

export interface Relationship {
  /**
   * Relationship ID
   */
  id: string

  /**
   * From namespace
   */
  fromNamespace: string

  /**
   * From document ID
   */
  fromId: string

  /**
   * To namespace
   */
  toNamespace: string

  /**
   * To document ID
   */
  toId: string

  /**
   * Relationship type
   */
  type: string

  /**
   * Relationship metadata
   */
  metadata?: Record<string, any>

  /**
   * Created timestamp
   */
  createdAt: string
}

export interface RelationshipsQuery {
  /**
   * From namespace
   */
  fromNamespace?: string

  /**
   * From document ID
   */
  fromId?: string

  /**
   * To namespace
   */
  toNamespace?: string

  /**
   * To document ID
   */
  toId?: string

  /**
   * Relationship type
   */
  type?: string

  /**
   * Maximum results
   */
  limit?: number

  /**
   * Pagination offset
   */
  offset?: number
}

// ============================================================================
// DATABASE SERVICE
// ============================================================================

export class DatabaseService {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl = 'https://db.do', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  /**
   * Get authorization headers for authenticated requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    return headers
  }

  /**
   * Create a new document
   *
   * @param namespace - Collection name
   * @param id - Document ID
   * @param type - Document type (optional)
   * @param data - Document data
   * @returns Created document
   *
   * @example
   * ```typescript
   * const user = await $.db.create('users', 'user_123', 'User', {
   *   name: 'John Doe',
   *   email: 'john@example.com',
   *   status: 'active'
   * })
   * console.log(user.id, user.data.name)
   * ```
   */
  async create<T = Record<string, any>>(namespace: string, id: string, type: string | undefined, data: T): Promise<Document<T>> {
    const response = await fetch(`${this.baseUrl}/${namespace}/${id}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ type, data }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create document: ${error}`)
    }

    return response.json()
  }

  /**
   * Read a document by ID
   *
   * @param namespace - Collection name
   * @param id - Document ID
   * @param fields - Fields to include (optional)
   * @returns Document or null if not found
   *
   * @example
   * ```typescript
   * const user = await $.db.read('users', 'user_123')
   * if (user) {
   *   console.log(user.data.name)
   * }
   *
   * // Read with field selection
   * const userProfile = await $.db.read('users', 'user_123', ['name', 'email'])
   * ```
   */
  async read<T = Record<string, any>>(namespace: string, id: string, fields?: string[]): Promise<Document<T> | null> {
    const params = new URLSearchParams()
    if (fields) {
      params.set('fields', fields.join(','))
    }

    const url = `${this.baseUrl}/${namespace}/${id}${params.toString() ? `?${params}` : ''}`

    const response = await fetch(url, {
      headers: this.getHeaders(),
    })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to read document: ${error}`)
    }

    return response.json()
  }

  /**
   * Update a document
   *
   * @param namespace - Collection name
   * @param id - Document ID
   * @param data - Partial data to update
   * @returns Updated document or null if not found
   *
   * @example
   * ```typescript
   * const updated = await $.db.update('users', 'user_123', {
   *   status: 'inactive',
   *   lastModified: new Date().toISOString()
   * })
   * ```
   */
  async update<T = Record<string, any>>(namespace: string, id: string, data: Partial<T>): Promise<Document<T> | null> {
    const response = await fetch(`${this.baseUrl}/${namespace}/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ data }),
    })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to update document: ${error}`)
    }

    return response.json()
  }

  /**
   * Delete a document (soft delete by default)
   *
   * @param namespace - Collection name
   * @param id - Document ID
   * @param hard - Permanent deletion (default: false)
   * @returns True if deleted
   *
   * @example
   * ```typescript
   * // Soft delete (sets deletedAt timestamp)
   * await $.db.delete('users', 'user_123')
   *
   * // Hard delete (permanent removal)
   * await $.db.delete('users', 'user_123', true)
   * ```
   */
  async delete(namespace: string, id: string, hard = false): Promise<boolean> {
    const params = new URLSearchParams()
    if (hard) {
      params.set('hard', 'true')
    }

    const response = await fetch(`${this.baseUrl}/${namespace}/${id}?${params}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })

    if (response.status === 404) {
      return false
    }

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to delete document: ${error}`)
    }

    return true
  }

  /**
   * List documents with filters
   *
   * @param namespace - Collection name
   * @param options - List options
   * @returns Documents and total count
   *
   * @example
   * ```typescript
   * const { documents, total } = await $.db.list('users', {
   *   type: 'User',
   *   limit: 20,
   *   offset: 0,
   *   sort: 'createdAt',
   *   order: 'desc'
   * })
   * ```
   */
  async list<T = Record<string, any>>(namespace: string, options: Omit<ListOptions, 'namespace'> = {}): Promise<ListResponse<T>> {
    const params = new URLSearchParams()

    if (options.type) params.set('type', options.type)
    if (options.limit) params.set('limit', options.limit.toString())
    if (options.offset) params.set('offset', options.offset.toString())
    if (options.sort) params.set('sort', options.sort)
    if (options.order) params.set('order', options.order)
    if (options.fields) params.set('fields', options.fields.join(','))

    const response = await fetch(`${this.baseUrl}/${namespace}?${params}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to list documents: ${error}`)
    }

    return response.json()
  }

  /**
   * Search documents with MongoDB-style query
   *
   * @param namespace - Collection name
   * @param query - MongoDB-style query object
   * @param options - Search options
   * @returns Matching documents and total count
   *
   * @example
   * ```typescript
   * // Query with operators
   * const activeUsers = await $.db.search('users', {
   *   status: { $eq: 'active' },
   *   age: { $gte: 18, $lt: 65 },
   *   country: { $in: ['US', 'UK', 'CA'] }
   * })
   *
   * // Simple equality query
   * const admins = await $.db.search('users', {
   *   role: 'admin'
   * })
   *
   * // Text search with contains
   * const results = await $.db.search('users', {
   *   name: { $contains: 'John' }
   * })
   * ```
   */
  async search<T = Record<string, any>>(namespace: string, query: MongoQuery, options: Omit<SearchOptions, 'namespace'> = {}): Promise<SearchResponse<T>> {
    const params = new URLSearchParams()

    if (options.type) params.set('type', options.type)
    if (options.limit) params.set('limit', options.limit.toString())
    if (options.offset) params.set('offset', options.offset.toString())
    if (options.fields) params.set('fields', options.fields.join(','))

    const response = await fetch(`${this.baseUrl}/${namespace}/search?${params}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to search documents: ${error}`)
    }

    return response.json()
  }

  /**
   * List documents with cursor pagination
   *
   * @param namespace - Collection name
   * @param options - Cursor pagination options
   * @returns Documents, next cursor, and hasMore flag
   *
   * @example
   * ```typescript
   * // First page
   * const page1 = await $.db.listWithCursor('users', {
   *   limit: 20,
   *   sort: 'createdAt',
   *   order: 'desc'
   * })
   *
   * // Next page
   * if (page1.hasMore) {
   *   const page2 = await $.db.listWithCursor('users', {
   *     limit: 20,
   *     cursor: page1.nextCursor
   *   })
   * }
   * ```
   */
  async listWithCursor<T = Record<string, any>>(namespace: string, options: Omit<CursorPageRequest, 'namespace'> = {}): Promise<CursorPageResponse<T>> {
    const params = new URLSearchParams()

    if (options.type) params.set('type', options.type)
    if (options.limit) params.set('limit', options.limit.toString())
    if (options.cursor) params.set('cursor', options.cursor)
    if (options.sort) params.set('sort', options.sort)
    if (options.order) params.set('order', options.order)
    if (options.fields) params.set('fields', options.fields.join(','))

    const response = await fetch(`${this.baseUrl}/${namespace}/cursor?${params}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to list with cursor: ${error}`)
    }

    return response.json()
  }

  /**
   * Search documents with cursor pagination
   *
   * @param namespace - Collection name
   * @param query - MongoDB-style query object
   * @param options - Cursor pagination options
   * @returns Documents, next cursor, and hasMore flag
   *
   * @example
   * ```typescript
   * // First page
   * const page1 = await $.db.searchWithCursor('users', {
   *   status: 'active'
   * }, {
   *   limit: 20
   * })
   *
   * // Next page
   * if (page1.hasMore) {
   *   const page2 = await $.db.searchWithCursor('users', {
   *     status: 'active'
   *   }, {
   *     limit: 20,
   *     cursor: page1.nextCursor
   *   })
   * }
   * ```
   */
  async searchWithCursor<T = Record<string, any>>(
    namespace: string,
    query: MongoQuery,
    options: Omit<CursorPageRequest, 'namespace'> = {}
  ): Promise<CursorPageResponse<T>> {
    const params = new URLSearchParams()

    if (options.type) params.set('type', options.type)
    if (options.limit) params.set('limit', options.limit.toString())
    if (options.cursor) params.set('cursor', options.cursor)
    if (options.sort) params.set('sort', options.sort)
    if (options.order) params.set('order', options.order)
    if (options.fields) params.set('fields', options.fields.join(','))

    const response = await fetch(`${this.baseUrl}/${namespace}/search/cursor?${params}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to search with cursor: ${error}`)
    }

    return response.json()
  }

  /**
   * Create multiple documents in a batch
   *
   * @param request - Batch create request
   * @returns Batch result with successful and failed operations
   *
   * @example
   * ```typescript
   * const result = await $.db.batchCreate({
   *   namespace: 'users',
   *   documents: [
   *     { id: 'user_1', type: 'User', data: { name: 'Alice' } },
   *     { id: 'user_2', type: 'User', data: { name: 'Bob' } },
   *     { id: 'user_3', type: 'User', data: { name: 'Charlie' } }
   *   ]
   * })
   * console.log(`Created ${result.successCount} documents`)
   * ```
   */
  async batchCreate<T = Record<string, any>>(request: BatchCreateRequest<T>): Promise<BatchResult<Document<T>>> {
    const response = await fetch(`${this.baseUrl}/${request.namespace}/batch/create`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to batch create: ${error}`)
    }

    return response.json()
  }

  /**
   * Update multiple documents in a batch
   *
   * @param request - Batch update request
   * @returns Batch result with successful and failed operations
   *
   * @example
   * ```typescript
   * const result = await $.db.batchUpdate({
   *   namespace: 'users',
   *   updates: [
   *     { id: 'user_1', data: { status: 'active' } },
   *     { id: 'user_2', data: { status: 'active' } },
   *     { id: 'user_3', data: { status: 'inactive' } }
   *   ]
   * })
   * console.log(`Updated ${result.successCount} documents`)
   * ```
   */
  async batchUpdate<T = Record<string, any>>(request: BatchUpdateRequest<T>): Promise<BatchResult<Document<T>>> {
    const response = await fetch(`${this.baseUrl}/${request.namespace}/batch/update`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to batch update: ${error}`)
    }

    return response.json()
  }

  /**
   * Delete multiple documents in a batch
   *
   * @param request - Batch delete request
   * @returns Batch result with successful and failed deletions
   *
   * @example
   * ```typescript
   * const result = await $.db.batchDelete({
   *   namespace: 'users',
   *   ids: ['user_1', 'user_2', 'user_3'],
   *   hard: false // Soft delete
   * })
   * console.log(`Deleted ${result.successCount} documents`)
   * ```
   */
  async batchDelete(request: BatchDeleteRequest): Promise<BatchResult<{ id: string; deleted: boolean }>> {
    const response = await fetch(`${this.baseUrl}/${request.namespace}/batch/delete`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to batch delete: ${error}`)
    }

    return response.json()
  }

  /**
   * Create a relationship between two documents
   *
   * @param fromNamespace - Source collection
   * @param fromId - Source document ID
   * @param toNamespace - Target collection
   * @param toId - Target document ID
   * @param type - Relationship type
   * @param metadata - Optional relationship metadata
   * @returns Created relationship
   *
   * @example
   * ```typescript
   * // Create user → order relationship
   * await $.db.relate('users', 'user_123', 'orders', 'order_456', 'placed', {
   *   placedAt: new Date().toISOString()
   * })
   *
   * // Create user → role relationship
   * await $.db.relate('users', 'user_123', 'roles', 'admin', 'has_role')
   * ```
   */
  async relate(fromNamespace: string, fromId: string, toNamespace: string, toId: string, type: string, metadata?: Record<string, any>): Promise<Relationship> {
    const response = await fetch(`${this.baseUrl}/relationships`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        fromNamespace,
        fromId,
        toNamespace,
        toId,
        type,
        metadata,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create relationship: ${error}`)
    }

    return response.json()
  }

  /**
   * Remove a relationship
   *
   * @param fromNamespace - Source collection
   * @param fromId - Source document ID
   * @param toNamespace - Target collection
   * @param toId - Target document ID
   * @param type - Relationship type
   * @returns Number of deleted relationships
   *
   * @example
   * ```typescript
   * await $.db.unrelate('users', 'user_123', 'orders', 'order_456', 'placed')
   * ```
   */
  async unrelate(fromNamespace: string, fromId: string, toNamespace: string, toId: string, type?: string): Promise<{ deleted: number }> {
    const body: any = {
      fromNamespace,
      fromId,
      toNamespace,
      toId,
    }

    if (type) {
      body.type = type
    }

    const response = await fetch(`${this.baseUrl}/relationships`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to remove relationship: ${error}`)
    }

    return response.json()
  }

  /**
   * Query relationships
   *
   * @param query - Relationship query filters
   * @returns Matching relationships
   *
   * @example
   * ```typescript
   * // Get all orders for a user
   * const orders = await $.db.queryRelationships({
   *   fromNamespace: 'users',
   *   fromId: 'user_123',
   *   toNamespace: 'orders',
   *   type: 'placed'
   * })
   *
   * // Get all users with admin role
   * const admins = await $.db.queryRelationships({
   *   toNamespace: 'roles',
   *   toId: 'admin',
   *   type: 'has_role'
   * })
   * ```
   */
  async queryRelationships(query: RelationshipsQuery): Promise<Relationship[]> {
    const params = new URLSearchParams()

    if (query.fromNamespace) params.set('fromNamespace', query.fromNamespace)
    if (query.fromId) params.set('fromId', query.fromId)
    if (query.toNamespace) params.set('toNamespace', query.toNamespace)
    if (query.toId) params.set('toId', query.toId)
    if (query.type) params.set('type', query.type)
    if (query.limit) params.set('limit', query.limit.toString())
    if (query.offset) params.set('offset', query.offset.toString())

    const response = await fetch(`${this.baseUrl}/relationships?${params}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to query relationships: ${error}`)
    }

    return response.json()
  }

  /**
   * Iterate over all documents in a namespace with batch processing
   *
   * Supports two execution modes:
   * - **Synchronous** (`useQueue: false`): Process batches immediately with concurrency control
   * - **Asynchronous** (`useQueue: true`): Queue batches for background processing
   *
   * @param namespace - Collection name
   * @param callback - Function to execute for each document
   * @param options - forEach options
   * @returns Processing result
   *
   * @example
   * ```typescript
   * // Send emails to all users (queue-backed)
   * await $.db.forEach('users', async (user) => {
   *   await $.api.post('https://email-service.com/send', {
   *     to: user.data.email,
   *     subject: 'Welcome!',
   *     body: `Hello ${user.data.name}!`
   *   })
   * }, {
   *   batchSize: 50,
   *   useQueue: true,
   *   continueOnError: true
   * })
   *
   * // Update products synchronously
   * await $.db.forEach('products', async (product) => {
   *   if (product.data.price < 10) {
   *     await $.db.update('products', product.id, {
   *       discount: 0.1
   *     })
   *   }
   * }, {
   *   batchSize: 100,
   *   useQueue: false,
   *   concurrency: 10
   * })
   * ```
   */
  async forEach<T = Record<string, any>>(
    namespace: string,
    callback: (doc: Document<T>) => Promise<void>,
    options: ForEachOptions = {}
  ): Promise<ForEachResult> {
    const { batchSize = 100, concurrency = 5, useQueue = true, queueName = 'db-foreach', continueOnError = false, onProgress, onError } = options

    if (!useQueue) {
      return this.forEachSync(namespace, callback, {
        batchSize,
        concurrency,
        continueOnError,
        onProgress,
        onError,
      })
    }

    return this.forEachQueue(namespace, callback, { ...options, batchSize, queueName })
  }

  /**
   * Synchronous forEach with concurrency control
   * @private
   */
  private async forEachSync<T = Record<string, any>>(
    namespace: string,
    callback: (doc: Document<T>) => Promise<void>,
    options: Required<Pick<ForEachOptions, 'batchSize' | 'concurrency' | 'continueOnError'>> & Pick<ForEachOptions, 'onProgress' | 'onError'>
  ): Promise<ForEachResult> {
    const { batchSize, concurrency, continueOnError, onProgress, onError } = options

    // Get total count
    const { total } = await this.list<T>(namespace, { limit: 0 })

    const result: ForEachResult = {
      processed: 0,
      success: 0,
      failed: 0,
      errors: [],
    }

    // Process in batches with concurrency control
    const batches = Math.ceil(total / batchSize)

    for (let batchIndex = 0; batchIndex < batches; batchIndex += concurrency) {
      // Create batch promises for concurrent execution
      const batchPromises = []

      for (let i = 0; i < concurrency && batchIndex + i < batches; i++) {
        const offset = (batchIndex + i) * batchSize
        batchPromises.push(this.processBatch<T>(namespace, offset, batchSize, callback, continueOnError, onError))
      }

      // Wait for all batches in this concurrency group to complete
      const batchResults = await Promise.all(batchPromises)

      // Aggregate results
      for (const batchResult of batchResults) {
        result.processed += batchResult.processed
        result.success += batchResult.success
        result.failed += batchResult.failed
        result.errors.push(...batchResult.errors)
      }

      // Report progress
      if (onProgress) {
        onProgress(result.processed, total)
      }
    }

    return result
  }

  /**
   * Process a single batch of documents
   * @private
   */
  private async processBatch<T = Record<string, any>>(
    namespace: string,
    offset: number,
    limit: number,
    callback: (doc: Document<T>) => Promise<void>,
    continueOnError: boolean,
    onError?: (error: Error, document: Document) => void
  ): Promise<ForEachResult> {
    const result: ForEachResult = {
      processed: 0,
      success: 0,
      failed: 0,
      errors: [],
    }

    // Fetch batch
    const { documents } = await this.list<T>(namespace, { offset, limit })

    // Process documents
    for (const doc of documents) {
      result.processed++
      try {
        await callback(doc)
        result.success++
      } catch (error) {
        result.failed++
        const errorMessage = error instanceof Error ? error.message : String(error)
        result.errors.push({
          documentId: doc.id,
          error: errorMessage,
        })

        if (onError && error instanceof Error) {
          onError(error, doc)
        }

        if (!continueOnError) {
          throw error
        }
      }
    }

    return result
  }

  /**
   * Queue-backed forEach for background processing
   * @private
   */
  private async forEachQueue<T = Record<string, any>>(
    namespace: string,
    callback: (doc: Document<T>) => Promise<void>,
    options: Required<Pick<ForEachOptions, 'batchSize' | 'queueName'>> & ForEachOptions
  ): Promise<ForEachResult> {
    const { batchSize, queueName } = options

    // Get total count
    const { total } = await this.list<T>(namespace, { limit: 0 })

    // Create job
    const jobId = crypto.randomUUID()

    // Queue batches
    const batches = Math.ceil(total / batchSize)

    // Note: Actual queue integration requires access to Cloudflare Queue binding
    // This is a placeholder that shows the intended API
    // In a real implementation, you would use:
    // await env.QUEUE.send({ jobId, namespace, offset, limit, callback: callback.toString(), options })

    console.warn(
      `db.forEach with useQueue=true requires Cloudflare Queue integration. ` +
        `Would queue ${batches} batches for job ${jobId}. ` +
        `Falling back to synchronous processing.`
    )

    // Fallback to synchronous processing
    return this.forEachSync(namespace, callback, {
      batchSize,
      concurrency: options.concurrency || 5,
      continueOnError: options.continueOnError || false,
      onProgress: options.onProgress,
      onError: options.onError,
    })
  }

  // ============================================================================
  // LAYER 3 INTEGRATION METHODS (workers/database)
  // ============================================================================

  /**
   * Execute a SQL query with parameterized values
   *
   * @param options - Query options with SQL and parameters
   * @returns Query result with rows and metadata
   *
   * @example
   * ```typescript
   * // Simple query
   * const result = await $.db.query({
   *   sql: 'SELECT * FROM users WHERE status = $1',
   *   params: ['active']
   * })
   * console.log(result.rows)
   *
   * // Query with multiple parameters
   * const users = await $.db.query({
   *   sql: 'SELECT * FROM users WHERE age >= $1 AND country = $2',
   *   params: [18, 'US'],
   *   maxRows: 100
   * })
   * ```
   */
  async query<T = any>(options: QueryOptions): Promise<QueryResult<T>> {
    const response = await fetch(`${this.baseUrl}/query`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to execute query: ${error}`)
    }

    return response.json()
  }

  /**
   * Execute multiple queries in a transaction
   *
   * @param options - Transaction options with queries
   * @returns Transaction result with all query results
   *
   * @example
   * ```typescript
   * const result = await $.db.transaction({
   *   queries: [
   *     {
   *       sql: 'INSERT INTO users (id, name) VALUES ($1, $2)',
   *       params: ['user_1', 'Alice']
   *     },
   *     {
   *       sql: 'INSERT INTO profiles (user_id, bio) VALUES ($1, $2)',
   *       params: ['user_1', 'Software Engineer']
   *     }
   *   ],
   *   isolationLevel: 'read committed'
   * })
   *
   * if (result.success) {
   *   console.log('Transaction committed successfully')
   * } else {
   *   console.error('Transaction rolled back:', result.error)
   * }
   * ```
   */
  async transaction(options: TransactionOptions): Promise<TransactionResult> {
    const response = await fetch(`${this.baseUrl}/transaction`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to execute transaction: ${error}`)
    }

    return response.json()
  }

  /**
   * Execute multiple queries in batch (non-transactional)
   *
   * @param options - Batch query options
   * @returns Batch result with individual query results
   *
   * @example
   * ```typescript
   * const result = await $.db.batch({
   *   queries: [
   *     { sql: 'SELECT COUNT(*) FROM users' },
   *     { sql: 'SELECT COUNT(*) FROM orders' },
   *     { sql: 'SELECT COUNT(*) FROM products' }
   *   ],
   *   continueOnError: true
   * })
   *
   * result.results.forEach((r, i) => {
   *   if ('error' in r) {
   *     console.error(`Query ${i} failed:`, r.error)
   *   } else {
   *     console.log(`Query ${i} rows:`, r.rows)
   *   }
   * })
   * ```
   */
  async batch(options: BatchQueryOptions): Promise<BatchQueryResult> {
    const response = await fetch(`${this.baseUrl}/batch`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to execute batch queries: ${error}`)
    }

    return response.json()
  }

  /**
   * Get database schema information
   *
   * @returns Schema info with tables and columns
   *
   * @example
   * ```typescript
   * const schema = await $.db.schema()
   *
   * schema.tables.forEach(table => {
   *   console.log(`Table: ${table.schema}.${table.name}`)
   *   table.columns.forEach(col => {
   *     console.log(`  - ${col.name}: ${col.type}${col.nullable ? ' (nullable)' : ''}`)
   *   })
   * })
   * ```
   */
  async schema(): Promise<SchemaInfo> {
    const response = await fetch(`${this.baseUrl}/schema`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get schema: ${error}`)
    }

    return response.json()
  }
}

/**
 * Create database service instance
 */
export function createDatabaseService(baseUrl?: string, apiKey?: string): DatabaseService {
  return new DatabaseService(baseUrl, apiKey)
}

/**
 * Default database service instance
 */
export const db = createDatabaseService()

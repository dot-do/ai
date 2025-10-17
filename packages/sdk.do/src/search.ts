/**
 * Search Service for SDK.do
 *
 * Provides methods for searching across all platform collections.
 * Supports full-text search, filtering, faceting, and autocomplete.
 *
 * @example
 * ```typescript
 * import { $ } from 'sdk.do'
 *
 * // Search across all collections
 * const results = await $.search.query('order', {
 *   collections: ['events', 'webhooks'],
 *   limit: 20
 * })
 *
 * // Get autocomplete suggestions
 * const suggestions = await $.search.suggest('ord')
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

export interface SearchResult {
  id: string
  collection: string
  title: string
  description?: string
  url?: string
  imageUrl?: string
  score: number
  highlights?: Record<string, string[]>
  metadata?: Record<string, any>
}

export interface SearchOptions {
  /**
   * Filter by specific collections
   */
  collections?: string[]

  /**
   * Results per page
   * @default 50
   */
  limit?: number

  /**
   * Page number (1-based)
   * @default 1
   */
  page?: number

  /**
   * Sort by field
   * @default 'relevance'
   */
  sort?: 'relevance' | 'date' | 'name' | 'size'

  /**
   * Sort order
   * @default 'desc'
   */
  order?: 'asc' | 'desc'

  /**
   * Additional filters
   */
  filters?: Record<string, any>

  /**
   * Facet fields to calculate
   */
  facets?: string[]

  /**
   * Use semantic/vector search
   * @default false
   */
  semantic?: boolean
}

export interface SearchResponse {
  results: SearchResult[]
  facets?: Record<string, { value: string; count: number }[]>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  query: {
    q: string
    collections?: string[]
    filters?: Record<string, any>
  }
  duration: number
}

export interface SuggestOptions {
  /**
   * Number of suggestions to return
   * @default 5
   */
  limit?: number

  /**
   * Filter by specific collections
   */
  collections?: string[]
}

export interface SuggestResponse {
  suggestions: string[]
  query: string
}

export interface CollectionInfo {
  name: string
  searchFields: string[]
  titleField: string
  descriptionField: string
  dateField: string
}

export interface CollectionsResponse {
  collections: CollectionInfo[]
  count: number
}

export interface SearchStats {
  total: number
  byCollection: Array<{
    collection: string
    count: number
  }>
  collections: number
}

// ============================================================================
// SEARCH SERVICE
// ============================================================================

export class SearchService {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl = 'https://api.do', apiKey?: string) {
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
   * Search across collections
   *
   * @param query - Search query string
   * @param options - Search options
   * @returns Search results with pagination and facets
   *
   * @example
   * ```typescript
   * const results = await $.search.query('order created', {
   *   collections: ['events', 'webhooks'],
   *   limit: 20,
   *   sort: 'date',
   *   facets: ['collection', 'status']
   * })
   *
   * console.log(results.pagination.total) // Total number of results
   * console.log(results.facets?.collection) // Facet counts by collection
   * ```
   */
  async query(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
    const params = new URLSearchParams()

    params.set('q', query)

    if (options.collections) {
      options.collections.forEach((c) => params.append('collections', c))
    }

    if (options.limit) params.set('limit', options.limit.toString())
    if (options.page) params.set('page', options.page.toString())
    if (options.sort) params.set('sort', options.sort)
    if (options.order) params.set('order', options.order)
    if (options.semantic) params.set('semantic', options.semantic.toString())

    if (options.filters) {
      params.set('filters', JSON.stringify(options.filters))
    }

    if (options.facets) {
      options.facets.forEach((f) => params.append('facets', f))
    }

    const response = await fetch(`${this.baseUrl}/v1/search?${params}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Search failed: ${error}`)
    }

    return response.json()
  }

  /**
   * Get search autocomplete suggestions
   *
   * @param query - Partial search query
   * @param options - Suggest options
   * @returns Array of suggested search terms
   *
   * @example
   * ```typescript
   * const suggestions = await $.search.suggest('ord', {
   *   limit: 10,
   *   collections: ['events']
   * })
   *
   * console.log(suggestions.suggestions) // ['Order', 'Order.created', 'Order.updated']
   * ```
   */
  async suggest(query: string, options: SuggestOptions = {}): Promise<SuggestResponse> {
    const params = new URLSearchParams()

    params.set('q', query)

    if (options.limit) params.set('limit', options.limit.toString())

    if (options.collections) {
      options.collections.forEach((c) => params.append('collections', c))
    }

    const response = await fetch(`${this.baseUrl}/v1/search/suggest?${params}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Search suggest failed: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get list of searchable collections
   *
   * @returns Information about all searchable collections
   *
   * @example
   * ```typescript
   * const collections = await $.search.getCollections()
   * console.log(collections.collections.map(c => c.name))
   * // ['events', 'media', 'users', 'webhooks', 'subscriptions']
   * ```
   */
  async getCollections(): Promise<CollectionsResponse> {
    const response = await fetch(`${this.baseUrl}/v1/search/collections`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get collections: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get search statistics
   *
   * @returns Statistics about searchable content
   *
   * @example
   * ```typescript
   * const stats = await $.search.getStats()
   * console.log(stats.total) // Total searchable documents
   * console.log(stats.byCollection) // Counts per collection
   * ```
   */
  async getStats(): Promise<SearchStats> {
    const response = await fetch(`${this.baseUrl}/v1/search/stats`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get search stats: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Helper method to search a specific collection
   *
   * @param collection - Collection name to search
   * @param query - Search query
   * @param options - Additional search options
   * @returns Search results
   *
   * @example
   * ```typescript
   * const events = await $.search.searchCollection('events', 'order created')
   * ```
   */
  async searchCollection(collection: string, query: string, options: Omit<SearchOptions, 'collections'> = {}): Promise<SearchResponse> {
    return this.query(query, {
      ...options,
      collections: [collection],
    })
  }

  /**
   * Helper method to check if a query has results
   *
   * @param query - Search query
   * @param options - Search options
   * @returns True if results found
   */
  async hasResults(query: string, options: SearchOptions = {}): Promise<boolean> {
    const results = await this.query(query, { ...options, limit: 1 })
    return results.results.length > 0
  }

  /**
   * Helper method to get the first result for a query
   *
   * @param query - Search query
   * @param options - Search options
   * @returns First search result or null
   */
  async findFirst(query: string, options: SearchOptions = {}): Promise<SearchResult | null> {
    const results = await this.query(query, { ...options, limit: 1 })
    return results.results[0] || null
  }

  /**
   * Helper method to count results for a query
   *
   * @param query - Search query
   * @param options - Search options
   * @returns Total number of results
   */
  async count(query: string, options: SearchOptions = {}): Promise<number> {
    const results = await this.query(query, { ...options, limit: 1 })
    return results.pagination.total
  }
}

/**
 * Create search service instance
 */
export function createSearchService(baseUrl?: string, apiKey?: string): SearchService {
  return new SearchService(baseUrl, apiKey)
}

/**
 * Default search service instance
 */
export const search = createSearchService()

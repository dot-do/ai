/**
 * verbs.do SDK - Semantic action execution with O*NET work activities
 *
 * This SDK provides a type-safe client for interacting with verbs.do,
 * which provides O*NET work activities, Schema.org Action types, and custom
 * verb definitions for semantic action execution.
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface VerbsClientConfig {
  baseUrl?: string
  timeout?: number
  headers?: Record<string, string>
}

export interface Verb {
  id: string
  type: 'Verb'
  name: string
  label: string
  description: string
  category: string
  source: 'onet' | 'schema.org' | 'custom'
  relatedNouns: string[]
  relatedVerbs: string[]
  aliases: string[]
  metadata: {
    onetCode?: string
    schemaOrgType?: string
    frequency?: number
    difficulty?: string
    [key: string]: unknown
  }
}

export interface CreateVerbRequest {
  name: string
  label?: string
  description: string
  category: string
  relatedNouns?: string[]
  aliases?: string[]
  metadata?: Record<string, unknown>
}

export interface UpdateVerbRequest {
  label?: string
  description?: string
  category?: string
  relatedNouns?: string[]
  relatedVerbs?: string[]
  aliases?: string[]
  metadata?: Record<string, unknown>
}

export interface ListVerbsOptions {
  category?: string
  source?: 'onet' | 'schema.org' | 'custom'
  limit?: number
  offset?: number
}

export interface ListVerbsResponse {
  verbs: Verb[]
  total: number
  limit: number
  offset: number
}

export interface SearchVerbsOptions {
  q: string
  limit?: number
}

export interface VerbSearchResult {
  id: string
  name: string
  label: string
  description: string
  category: string
  source: 'onet' | 'schema.org' | 'custom'
  relevance: number
}

export interface SearchVerbsResponse {
  results: VerbSearchResult[]
  total: number
  query: string
}

export interface RelatedEntity {
  id: string
  name: string
  label: string
  relationship?: string
  similarity?: number
  frequency?: number
}

export interface RelatedEntitiesResponse {
  verb: string
  related: {
    nouns?: RelatedEntity[]
    verbs?: RelatedEntity[]
  }
}

export interface VerbCategory {
  name: string
  count: number
  description: string
}

export interface ListCategoriesResponse {
  categories: VerbCategory[]
  total: number
}

// LLM Tool formats
export interface OpenAITool {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: {
      type: 'object'
      properties: Record<string, any>
      required?: string[]
    }
  }
}

export interface AnthropicTool {
  name: string
  description: string
  input_schema: {
    type: 'object'
    properties: Record<string, any>
    required?: string[]
  }
}

export interface LangChainTool {
  name: string
  description: string
  schema: Record<string, any>
}

// ============================================================================
// Client Implementation
// ============================================================================

export class VerbsClient {
  private baseUrl: string
  private timeout: number
  private headers: Record<string, string>

  constructor(config: VerbsClientConfig = {}) {
    this.baseUrl = config.baseUrl || 'https://verbs.do'
    this.timeout = config.timeout || 10000
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    }
  }

  /**
   * List all verbs with optional filtering
   */
  async list(options: ListVerbsOptions = {}): Promise<ListVerbsResponse> {
    const params = new URLSearchParams()
    if (options.category) params.set('category', options.category)
    if (options.source) params.set('source', options.source)
    if (options.limit) params.set('limit', String(options.limit))
    if (options.offset) params.set('offset', String(options.offset))

    const url = `/verbs?${params}`
    const response = await this.fetch(url)
    return response.json() as Promise<ListVerbsResponse>
  }

  /**
   * Get a verb by name
   */
  async get(name: string): Promise<Verb | null> {
    try {
      const response = await this.fetch(`/verbs/${encodeURIComponent(name)}`)
      return response.json() as Promise<Verb>
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  /**
   * Create a new custom verb
   */
  async create(data: CreateVerbRequest): Promise<Verb> {
    const response = await this.fetch('/verbs', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.json() as Promise<Verb>
  }

  /**
   * Update an existing verb
   */
  async update(name: string, data: UpdateVerbRequest): Promise<Verb> {
    const response = await this.fetch(`/verbs/${encodeURIComponent(name)}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    return response.json() as Promise<Verb>
  }

  /**
   * Delete a verb
   */
  async delete(name: string): Promise<void> {
    await this.fetch(`/verbs/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    })
  }

  /**
   * Search verbs by query string
   */
  async search(options: SearchVerbsOptions): Promise<SearchVerbsResponse> {
    const response = await this.fetch('/verbs/search', {
      method: 'POST',
      body: JSON.stringify(options),
    })
    return response.json() as Promise<SearchVerbsResponse>
  }

  /**
   * Get related entities (nouns and verbs) for a verb
   */
  async related(name: string, type: 'all' | 'nouns' | 'verbs' = 'all'): Promise<RelatedEntitiesResponse> {
    const params = new URLSearchParams()
    if (type !== 'all') params.set('type', type)

    const url = `/verbs/${encodeURIComponent(name)}/related?${params}`
    const response = await this.fetch(url)
    return response.json() as Promise<RelatedEntitiesResponse>
  }

  /**
   * List all verb categories with counts
   */
  async categories(): Promise<ListCategoriesResponse> {
    const response = await this.fetch('/verbs/categories')
    return response.json() as Promise<ListCategoriesResponse>
  }

  /**
   * Get health status
   */
  async health(): Promise<{ status: string; version: string; timestamp: number }> {
    const response = await this.fetch('/')
    return response.json() as Promise<{ status: string; version: string; timestamp: number }>
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
        const error = (await response.json().catch(() => ({
          message: response.statusText,
          status: response.status,
          statusText: response.statusText,
        }))) as {
          error?: string
          message?: string
          status?: number
          statusText?: string
        }
        throw new Error(error.error || error.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      return response
    } finally {
      clearTimeout(timeoutId)
    }
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Create a verbs client
 */
export function createClient(config?: VerbsClientConfig): VerbsClient {
  return new VerbsClient(config)
}

// Create default client for convenience
const defaultClient = new VerbsClient()

/**
 * List verbs using default client
 */
export async function list(options?: ListVerbsOptions): Promise<ListVerbsResponse> {
  return defaultClient.list(options)
}

/**
 * Get a verb using default client
 */
export async function get(name: string): Promise<Verb | null> {
  return defaultClient.get(name)
}

/**
 * Create a verb using default client
 */
export async function create(data: CreateVerbRequest): Promise<Verb> {
  return defaultClient.create(data)
}

/**
 * Update a verb using default client
 */
export async function update(name: string, data: UpdateVerbRequest): Promise<Verb> {
  return defaultClient.update(name, data)
}

/**
 * Delete a verb using default client
 */
export async function deleteVerb(name: string): Promise<void> {
  return defaultClient.delete(name)
}

/**
 * Search verbs using default client
 */
export async function search(query: string, limit?: number): Promise<SearchVerbsResponse> {
  return defaultClient.search({ q: query, limit })
}

/**
 * Get related entities using default client
 */
export async function related(name: string, type?: 'all' | 'nouns' | 'verbs'): Promise<RelatedEntitiesResponse> {
  return defaultClient.related(name, type)
}

/**
 * List categories using default client
 */
export async function categories(): Promise<ListCategoriesResponse> {
  return defaultClient.categories()
}

// ============================================================================
// LLM Integration Utilities
// ============================================================================

/**
 * Convert a verb to OpenAI function calling format
 */
export function toOpenAITool(verb: Verb): OpenAITool {
  return {
    type: 'function',
    function: {
      name: verb.name,
      description: verb.description,
      parameters: {
        type: 'object',
        properties: {
          // Generate properties from related nouns
          ...verb.relatedNouns.reduce(
            (acc, noun) => ({
              ...acc,
              [noun]: {
                type: 'string',
                description: `The ${noun} to ${verb.name}`,
              },
            }),
            {},
          ),
          // Add metadata fields
          metadata: {
            type: 'object',
            description: 'Additional metadata for the action',
          },
        },
        required: verb.relatedNouns.length > 0 ? verb.relatedNouns.slice(0, 1) : undefined, // First noun is required if available
      },
    },
  }
}

/**
 * Convert a verb to Anthropic tools format
 */
export function toAnthropicTool(verb: Verb): AnthropicTool {
  return {
    name: verb.name,
    description: verb.description,
    input_schema: {
      type: 'object',
      properties: {
        // Generate properties from related nouns
        ...verb.relatedNouns.reduce(
          (acc, noun) => ({
            ...acc,
            [noun]: {
              type: 'string',
              description: `The ${noun} to ${verb.name}`,
            },
          }),
          {},
        ),
        // Add metadata fields
        metadata: {
          type: 'object',
          description: 'Additional metadata for the action',
        },
      },
      required: verb.relatedNouns.length > 0 ? verb.relatedNouns.slice(0, 1) : undefined, // First noun is required if available
    },
  }
}

/**
 * Convert a verb to LangChain tools format
 */
export function toLangChainTool(verb: Verb): LangChainTool {
  return {
    name: verb.name,
    description: verb.description,
    schema: {
      type: 'object',
      properties: {
        // Generate properties from related nouns
        ...verb.relatedNouns.reduce(
          (acc, noun) => ({
            ...acc,
            [noun]: {
              type: 'string',
              description: `The ${noun} to ${verb.name}`,
            },
          }),
          {},
        ),
        // Add metadata fields
        metadata: {
          type: 'object',
          description: 'Additional metadata for the action',
        },
      },
      required: verb.relatedNouns.length > 0 ? verb.relatedNouns.slice(0, 1) : undefined, // First noun is required if available
    },
  }
}

/**
 * Convert multiple verbs to OpenAI tools format
 */
export function toOpenAITools(verbs: Verb[]): OpenAITool[] {
  return verbs.map(toOpenAITool)
}

/**
 * Convert multiple verbs to Anthropic tools format
 */
export function toAnthropicTools(verbs: Verb[]): AnthropicTool[] {
  return verbs.map(toAnthropicTool)
}

/**
 * Convert multiple verbs to LangChain tools format
 */
export function toLangChainTools(verbs: Verb[]): LangChainTool[] {
  return verbs.map(toLangChainTool)
}

// ============================================================================
// O*NET Integration Helpers
// ============================================================================

/**
 * Get all verbs from O*NET work activities
 */
export async function getONETVerbs(options?: ListVerbsOptions): Promise<Verb[]> {
  const response = await list({
    ...options,
    source: 'onet',
  })
  return response.verbs
}

/**
 * Get verbs by O*NET code
 *
 * Note: This currently fetches all O*NET verbs and filters client-side.
 * For better performance with large datasets, consider using the search API
 * or requesting server-side filtering support from verbs.do.
 */
export async function getVerbsByONETCode(onetCode: string): Promise<Verb[]> {
  // TODO: Add server-side filtering support to verbs.do API
  const allVerbs = await getONETVerbs()
  return allVerbs.filter((verb) => verb.metadata.onetCode === onetCode)
}

/**
 * Get verbs by Schema.org Action type
 *
 * Note: This fetches all Schema.org verbs and filters client-side.
 * For better performance, consider using the search API or requesting
 * server-side filtering support from verbs.do.
 */
export async function getVerbsBySchemaOrgType(schemaType: string): Promise<Verb[]> {
  // TODO: Add server-side filtering support to verbs.do API
  const response = await list({
    source: 'schema.org',
  })
  return response.verbs.filter((verb) => verb.metadata.schemaOrgType === schemaType)
}

/**
 * Get verbs by category
 */
export async function getVerbsByCategory(category: string): Promise<Verb[]> {
  const response = await list({
    category,
  })
  return response.verbs
}

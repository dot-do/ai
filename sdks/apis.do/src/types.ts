export interface ErrorResponse {
  errors?: Array<{
    message: string
    code?: string
    path?: string
  }>
}

export interface ListResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    hasNextPage: boolean
    hasPreviousPage?: boolean
    totalPages?: number
  }
  error?: ErrorResponse
}

export interface QueryParams {
  [key: string]: any
  limit?: number
  page?: number
  sort?: string | string[]
  where?: Record<string, any>
}

/**
 * Parameters for the research function
 */
export interface ResearchParams {
  /**
   * Topic to research
   */
  topic?: string
  
  /**
   * Idea object to research
   */
  idea?: Record<string, any>
  
  /**
   * Lean Canvas model related to the idea
   */
  leanCanvas?: Record<string, any>
}

/**
 * Result from the research function
 */
export interface ResearchResult {
  /**
   * Research findings and analysis
   */
  findings?: Record<string, any>
  
  /**
   * Market analysis data
   */
  marketAnalysis?: Record<string, any>
  
  /**
   * Competitive landscape information
   */
  competitiveAnalysis?: Record<string, any>
  
  /**
   * Additional metadata about the research
   */
  meta?: Record<string, any>
}

/**
 * Client configuration options
 */
export interface ClientOptions {
  /**
   * Base URL for API requests
   * @default 'https://api.do'
   */
  baseUrl?: string

  /**
   * API key for authentication
   */
  apiKey?: string

  /**
   * Custom fetch implementation
   */
  fetch?: typeof fetch

  /**
   * Skip SSL certificate validation (only for testing)
   */
  ignoreSSLErrors?: boolean

  /**
   * Additional headers to include with requests
   */
  headers?: Record<string, string>
}

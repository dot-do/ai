/**
 * Batch Operations Service for SDK.do
 *
 * Provides methods for executing multiple API requests in a single call.
 * Supports parallel execution, sequential execution, and dependency management.
 *
 * @example
 * ```typescript
 * import { $ } from 'sdk.do'
 *
 * // Execute multiple requests in parallel
 * const result = await $.batch.execute({
 *   requests: [
 *     {
 *       id: 'req1',
 *       method: 'POST',
 *       path: '/v1/events/publish',
 *       body: { type: '$.Order.created', data: {...} }
 *     },
 *     {
 *       id: 'req2',
 *       method: 'GET',
 *       path: '/v1/media?folder=uploads'
 *     }
 *   ]
 * })
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

export interface BatchRequest {
  /**
   * Unique identifier for this request
   */
  id: string

  /**
   * HTTP method
   */
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

  /**
   * API path (e.g., "/v1/events/publish")
   */
  path: string

  /**
   * Request headers
   */
  headers?: Record<string, string>

  /**
   * Request body (will be JSON stringified)
   */
  body?: any

  /**
   * IDs of requests this depends on
   */
  dependsOn?: string[]
}

export interface BatchResponse {
  id: string
  status: number
  statusText: string
  headers: Record<string, string>
  body: any
  error?: {
    type: string
    message: string
  }
  duration: number
}

export interface BatchExecuteOptions {
  /**
   * Array of requests to execute
   */
  requests: BatchRequest[]

  /**
   * Execute sequentially vs parallel
   * @default false
   */
  sequential?: boolean

  /**
   * Stop batch on first error
   * @default false
   */
  stopOnError?: boolean

  /**
   * Continue on error
   * @default true
   */
  continueOnError?: boolean
}

export interface BatchResult {
  responses: BatchResponse[]
  summary: {
    total: number
    successful: number
    failed: number
    duration: number
  }
}

export interface BatchValidationResult {
  valid: boolean
  issues?: string[]
  errors?: Record<string, any>
  summary?: {
    totalRequests: number
    uniqueIds: number
    withDependencies: number
  }
}

export interface BatchCapabilities {
  capabilities: {
    maxRequestsPerBatch: number
    supportedMethods: string[]
    parallelExecution: boolean
    sequentialExecution: boolean
    dependencyManagement: boolean
    stopOnError: boolean
  }
  features: string[]
  limits: {
    maxRequestsPerBatch: number
    maxRequestBodySize: string
    maxResponseBodySize: string
    maxBatchDuration: string
  }
}

// ============================================================================
// BATCH SERVICE
// ============================================================================

export class BatchService {
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
   * Execute multiple API requests in a single call
   *
   * @param options - Batch execution options
   * @returns Batch result with responses and summary
   *
   * @example
   * ```typescript
   * const result = await $.batch.execute({
   *   requests: [
   *     {
   *       id: 'createUser',
   *       method: 'POST',
   *       path: '/v1/users',
   *       body: { name: 'John', email: 'john@example.com' }
   *     },
   *     {
   *       id: 'listUsers',
   *       method: 'GET',
   *       path: '/v1/users'
   *     }
   *   ],
   *   sequential: false
   * })
   *
   * console.log(result.summary) // { total: 2, successful: 2, failed: 0, duration: 123 }
   * ```
   */
  async execute(options: BatchExecuteOptions): Promise<BatchResult> {
    const response = await fetch(`${this.baseUrl}/v1/batch/execute`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Batch execution failed: ${error}`)
    }

    return response.json()
  }

  /**
   * Validate a batch operation without executing
   *
   * @param options - Batch execution options to validate
   * @returns Validation result with any issues found
   *
   * @example
   * ```typescript
   * const validation = await $.batch.validate({
   *   requests: [
   *     { id: 'req1', method: 'GET', path: '/v1/users' },
   *     { id: 'req2', method: 'POST', path: '/v1/users', dependsOn: ['req1'] }
   *   ]
   * })
   *
   * if (!validation.valid) {
   *   console.error('Validation issues:', validation.issues)
   * }
   * ```
   */
  async validate(options: BatchExecuteOptions): Promise<BatchValidationResult> {
    const response = await fetch(`${this.baseUrl}/v1/batch/validate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      throw new Error(`Batch validation failed: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get batch operation capabilities and limits
   *
   * @returns Batch capabilities information
   *
   * @example
   * ```typescript
   * const capabilities = await $.batch.getCapabilities()
   * console.log(capabilities.limits.maxRequestsPerBatch) // 100
   * ```
   */
  async getCapabilities(): Promise<BatchCapabilities> {
    const response = await fetch(`${this.baseUrl}/v1/batch`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get batch capabilities: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Helper method to create a batch request
   *
   * @param id - Unique request ID
   * @param method - HTTP method
   * @param path - API path
   * @param options - Additional request options
   * @returns BatchRequest object
   *
   * @example
   * ```typescript
   * const request = $.batch.createRequest('req1', 'GET', '/v1/users')
   * ```
   */
  createRequest(
    id: string,
    method: BatchRequest['method'],
    path: string,
    options?: {
      headers?: Record<string, string>
      body?: any
      dependsOn?: string[]
    }
  ): BatchRequest {
    return {
      id,
      method,
      path,
      headers: options?.headers,
      body: options?.body,
      dependsOn: options?.dependsOn,
    }
  }

  /**
   * Helper method to execute a simple batch of GET requests
   *
   * @param paths - Array of API paths to fetch
   * @returns Batch result
   *
   * @example
   * ```typescript
   * const result = await $.batch.getAll([
   *   '/v1/users',
   *   '/v1/media',
   *   '/v1/events'
   * ])
   * ```
   */
  async getAll(paths: string[]): Promise<BatchResult> {
    const requests = paths.map((path, index) => ({
      id: `get_${index}`,
      method: 'GET' as const,
      path,
    }))

    return this.execute({ requests })
  }

  /**
   * Helper method to check if all requests in a batch were successful
   *
   * @param result - Batch result to check
   * @returns True if all requests succeeded
   */
  isAllSuccessful(result: BatchResult): boolean {
    return result.summary.failed === 0
  }

  /**
   * Helper method to get successful responses from a batch result
   *
   * @param result - Batch result
   * @returns Array of successful responses
   */
  getSuccessful(result: BatchResult): BatchResponse[] {
    return result.responses.filter((r) => r.status >= 200 && r.status < 300)
  }

  /**
   * Helper method to get failed responses from a batch result
   *
   * @param result - Batch result
   * @returns Array of failed responses
   */
  getFailed(result: BatchResult): BatchResponse[] {
    return result.responses.filter((r) => r.status < 200 || r.status >= 300)
  }
}

/**
 * Create batch service instance
 */
export function createBatchService(baseUrl?: string, apiKey?: string): BatchService {
  return new BatchService(baseUrl, apiKey)
}

/**
 * Default batch service instance
 */
export const batch = createBatchService()

/**
 * Elasticsearch Errors
 *
 * Auto-generated error handling for Elasticsearch Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/elasticsearch
 */

/**
 * Error type enum
 */
export enum ElasticsearchErrorType {
  Authentication = 'authentication',
  Authorization = 'authorization',
  Validation = 'validation',
  NotFound = 'not_found',
  RateLimit = 'rate_limit',
  Server = 'server',
  Network = 'network',
  Unknown = 'unknown',
}

/**
 * Elasticsearch Error class
 *
 * Custom error class for Elasticsearch Integration operations.
 */
export class ElasticsearchError extends Error {
  public readonly code: string | number
  public readonly type: ElasticsearchErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ElasticsearchErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ElasticsearchError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ElasticsearchError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ElasticsearchError instance
   */
  static fromError(error: any): ElasticsearchError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ElasticsearchErrorType; retryable: boolean }> = {
      '401': { type: ElasticsearchErrorType.Authentication, retryable: false },
      '429': { type: ElasticsearchErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ElasticsearchError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ElasticsearchErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ElasticsearchErrorType.Authentication
    } else if (statusCode === 403) {
      type = ElasticsearchErrorType.Authorization
    } else if (statusCode === 404) {
      type = ElasticsearchErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ElasticsearchErrorType.Validation
    } else if (statusCode === 429) {
      type = ElasticsearchErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ElasticsearchErrorType.Server
      retryable = true
    }

    return new ElasticsearchError(message, code, type, {
      statusCode,
      retryable,
      originalError: error,
    })
  }

  /** Check if error is retryable */
  isRetriable(): boolean {
    return this.retryable
  }

  /** Check if error is authentication error */
  isAuthenticationError(): boolean {
    return this.type === ElasticsearchErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ElasticsearchErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ElasticsearchErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ElasticsearchErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ElasticsearchErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ElasticsearchErrorType.Server
  }

  /** Get error details as object */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      type: this.type,
      statusCode: this.statusCode,
      retryable: this.retryable,
    }
  }
}

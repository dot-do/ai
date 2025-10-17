/**
 * Algolia Errors
 *
 * Auto-generated error handling for Algolia Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/algolia
 */

/**
 * Error type enum
 */
export enum AlgoliaErrorType {
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
 * Algolia Error class
 *
 * Custom error class for Algolia Integration operations.
 */
export class AlgoliaError extends Error {
  public readonly code: string | number
  public readonly type: AlgoliaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AlgoliaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AlgoliaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AlgoliaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AlgoliaError instance
   */
  static fromError(error: any): AlgoliaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AlgoliaErrorType; retryable: boolean }> = {
      '401': { type: AlgoliaErrorType.Authentication, retryable: false },
      '429': { type: AlgoliaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AlgoliaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AlgoliaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AlgoliaErrorType.Authentication
    } else if (statusCode === 403) {
      type = AlgoliaErrorType.Authorization
    } else if (statusCode === 404) {
      type = AlgoliaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AlgoliaErrorType.Validation
    } else if (statusCode === 429) {
      type = AlgoliaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AlgoliaErrorType.Server
      retryable = true
    }

    return new AlgoliaError(message, code, type, {
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
    return this.type === AlgoliaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AlgoliaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AlgoliaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AlgoliaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AlgoliaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AlgoliaErrorType.Server
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

/**
 * Affinity Errors
 *
 * Auto-generated error handling for Affinity Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/affinity
 */

/**
 * Error type enum
 */
export enum AffinityErrorType {
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
 * Affinity Error class
 *
 * Custom error class for Affinity Integration operations.
 */
export class AffinityError extends Error {
  public readonly code: string | number
  public readonly type: AffinityErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AffinityErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AffinityError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AffinityError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AffinityError instance
   */
  static fromError(error: any): AffinityError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AffinityErrorType; retryable: boolean }> = {
      '401': { type: AffinityErrorType.Authentication, retryable: false },
      '429': { type: AffinityErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AffinityError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AffinityErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AffinityErrorType.Authentication
    } else if (statusCode === 403) {
      type = AffinityErrorType.Authorization
    } else if (statusCode === 404) {
      type = AffinityErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AffinityErrorType.Validation
    } else if (statusCode === 429) {
      type = AffinityErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AffinityErrorType.Server
      retryable = true
    }

    return new AffinityError(message, code, type, {
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
    return this.type === AffinityErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AffinityErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AffinityErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AffinityErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AffinityErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AffinityErrorType.Server
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

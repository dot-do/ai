/**
 * Smugmug Errors
 *
 * Auto-generated error handling for Smugmug Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/smugmug
 */

/**
 * Error type enum
 */
export enum SmugmugErrorType {
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
 * Smugmug Error class
 *
 * Custom error class for Smugmug Integration operations.
 */
export class SmugmugError extends Error {
  public readonly code: string | number
  public readonly type: SmugmugErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SmugmugErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SmugmugError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SmugmugError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SmugmugError instance
   */
  static fromError(error: any): SmugmugError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SmugmugErrorType; retryable: boolean }> = {
      '401': { type: SmugmugErrorType.Authentication, retryable: false },
      '429': { type: SmugmugErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SmugmugError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SmugmugErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SmugmugErrorType.Authentication
    } else if (statusCode === 403) {
      type = SmugmugErrorType.Authorization
    } else if (statusCode === 404) {
      type = SmugmugErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SmugmugErrorType.Validation
    } else if (statusCode === 429) {
      type = SmugmugErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SmugmugErrorType.Server
      retryable = true
    }

    return new SmugmugError(message, code, type, {
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
    return this.type === SmugmugErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SmugmugErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SmugmugErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SmugmugErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SmugmugErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SmugmugErrorType.Server
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

/**
 * Storeganise Errors
 *
 * Auto-generated error handling for Storeganise Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/storeganise
 */

/**
 * Error type enum
 */
export enum StoreganiseErrorType {
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
 * Storeganise Error class
 *
 * Custom error class for Storeganise Integration operations.
 */
export class StoreganiseError extends Error {
  public readonly code: string | number
  public readonly type: StoreganiseErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: StoreganiseErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'StoreganiseError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StoreganiseError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns StoreganiseError instance
   */
  static fromError(error: any): StoreganiseError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: StoreganiseErrorType; retryable: boolean }> = {
      '401': { type: StoreganiseErrorType.Authentication, retryable: false },
      '429': { type: StoreganiseErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new StoreganiseError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = StoreganiseErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = StoreganiseErrorType.Authentication
    } else if (statusCode === 403) {
      type = StoreganiseErrorType.Authorization
    } else if (statusCode === 404) {
      type = StoreganiseErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = StoreganiseErrorType.Validation
    } else if (statusCode === 429) {
      type = StoreganiseErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = StoreganiseErrorType.Server
      retryable = true
    }

    return new StoreganiseError(message, code, type, {
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
    return this.type === StoreganiseErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === StoreganiseErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === StoreganiseErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === StoreganiseErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === StoreganiseErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === StoreganiseErrorType.Server
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

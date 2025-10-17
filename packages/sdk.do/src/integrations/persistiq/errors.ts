/**
 * Persistiq Errors
 *
 * Auto-generated error handling for Persistiq Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/persistiq
 */

/**
 * Error type enum
 */
export enum PersistiqErrorType {
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
 * Persistiq Error class
 *
 * Custom error class for Persistiq Integration operations.
 */
export class PersistiqError extends Error {
  public readonly code: string | number
  public readonly type: PersistiqErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PersistiqErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PersistiqError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PersistiqError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PersistiqError instance
   */
  static fromError(error: any): PersistiqError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PersistiqErrorType; retryable: boolean }> = {
      '401': { type: PersistiqErrorType.Authentication, retryable: false },
      '429': { type: PersistiqErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PersistiqError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PersistiqErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PersistiqErrorType.Authentication
    } else if (statusCode === 403) {
      type = PersistiqErrorType.Authorization
    } else if (statusCode === 404) {
      type = PersistiqErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PersistiqErrorType.Validation
    } else if (statusCode === 429) {
      type = PersistiqErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PersistiqErrorType.Server
      retryable = true
    }

    return new PersistiqError(message, code, type, {
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
    return this.type === PersistiqErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PersistiqErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PersistiqErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PersistiqErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PersistiqErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PersistiqErrorType.Server
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

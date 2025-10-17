/**
 * Coda Errors
 *
 * Auto-generated error handling for Coda Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/coda
 */

/**
 * Error type enum
 */
export enum CodaErrorType {
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
 * Coda Error class
 *
 * Custom error class for Coda Integration operations.
 */
export class CodaError extends Error {
  public readonly code: string | number
  public readonly type: CodaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CodaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CodaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CodaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CodaError instance
   */
  static fromError(error: any): CodaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CodaErrorType; retryable: boolean }> = {
      '401': { type: CodaErrorType.Authentication, retryable: false },
      '429': { type: CodaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CodaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CodaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CodaErrorType.Authentication
    } else if (statusCode === 403) {
      type = CodaErrorType.Authorization
    } else if (statusCode === 404) {
      type = CodaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CodaErrorType.Validation
    } else if (statusCode === 429) {
      type = CodaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CodaErrorType.Server
      retryable = true
    }

    return new CodaError(message, code, type, {
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
    return this.type === CodaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CodaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CodaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CodaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CodaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CodaErrorType.Server
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

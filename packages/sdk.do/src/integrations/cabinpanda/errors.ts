/**
 * Cabinpanda Errors
 *
 * Auto-generated error handling for Cabinpanda Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/cabinpanda
 */

/**
 * Error type enum
 */
export enum CabinpandaErrorType {
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
 * Cabinpanda Error class
 *
 * Custom error class for Cabinpanda Integration operations.
 */
export class CabinpandaError extends Error {
  public readonly code: string | number
  public readonly type: CabinpandaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CabinpandaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CabinpandaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CabinpandaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CabinpandaError instance
   */
  static fromError(error: any): CabinpandaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CabinpandaErrorType; retryable: boolean }> = {
      '401': { type: CabinpandaErrorType.Authentication, retryable: false },
      '429': { type: CabinpandaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CabinpandaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CabinpandaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CabinpandaErrorType.Authentication
    } else if (statusCode === 403) {
      type = CabinpandaErrorType.Authorization
    } else if (statusCode === 404) {
      type = CabinpandaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CabinpandaErrorType.Validation
    } else if (statusCode === 429) {
      type = CabinpandaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CabinpandaErrorType.Server
      retryable = true
    }

    return new CabinpandaError(message, code, type, {
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
    return this.type === CabinpandaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CabinpandaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CabinpandaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CabinpandaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CabinpandaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CabinpandaErrorType.Server
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

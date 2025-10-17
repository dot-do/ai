/**
 * Ring central Errors
 *
 * Auto-generated error handling for Ring central Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ring_central
 */

/**
 * Error type enum
 */
export enum RingCentralErrorType {
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
 * Ring central Error class
 *
 * Custom error class for Ring central Integration operations.
 */
export class RingCentralError extends Error {
  public readonly code: string | number
  public readonly type: RingCentralErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RingCentralErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RingCentralError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RingCentralError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RingCentralError instance
   */
  static fromError(error: any): RingCentralError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RingCentralErrorType; retryable: boolean }> = {
      '401': { type: RingCentralErrorType.Authentication, retryable: false },
      '429': { type: RingCentralErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RingCentralError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RingCentralErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RingCentralErrorType.Authentication
    } else if (statusCode === 403) {
      type = RingCentralErrorType.Authorization
    } else if (statusCode === 404) {
      type = RingCentralErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RingCentralErrorType.Validation
    } else if (statusCode === 429) {
      type = RingCentralErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RingCentralErrorType.Server
      retryable = true
    }

    return new RingCentralError(message, code, type, {
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
    return this.type === RingCentralErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RingCentralErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RingCentralErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RingCentralErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RingCentralErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RingCentralErrorType.Server
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

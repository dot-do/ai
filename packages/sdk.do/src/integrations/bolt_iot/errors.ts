/**
 * Bolt iot Errors
 *
 * Auto-generated error handling for Bolt iot Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bolt_iot
 */

/**
 * Error type enum
 */
export enum BoltIotErrorType {
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
 * Bolt iot Error class
 *
 * Custom error class for Bolt iot Integration operations.
 */
export class BoltIotError extends Error {
  public readonly code: string | number
  public readonly type: BoltIotErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BoltIotErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BoltIotError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BoltIotError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BoltIotError instance
   */
  static fromError(error: any): BoltIotError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BoltIotErrorType; retryable: boolean }> = {
      '401': { type: BoltIotErrorType.Authentication, retryable: false },
      '429': { type: BoltIotErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BoltIotError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BoltIotErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BoltIotErrorType.Authentication
    } else if (statusCode === 403) {
      type = BoltIotErrorType.Authorization
    } else if (statusCode === 404) {
      type = BoltIotErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BoltIotErrorType.Validation
    } else if (statusCode === 429) {
      type = BoltIotErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BoltIotErrorType.Server
      retryable = true
    }

    return new BoltIotError(message, code, type, {
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
    return this.type === BoltIotErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BoltIotErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BoltIotErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BoltIotErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BoltIotErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BoltIotErrorType.Server
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

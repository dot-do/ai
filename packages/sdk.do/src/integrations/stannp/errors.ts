/**
 * Stannp Errors
 *
 * Auto-generated error handling for Stannp Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/stannp
 */

/**
 * Error type enum
 */
export enum StannpErrorType {
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
 * Stannp Error class
 *
 * Custom error class for Stannp Integration operations.
 */
export class StannpError extends Error {
  public readonly code: string | number
  public readonly type: StannpErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: StannpErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'StannpError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StannpError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns StannpError instance
   */
  static fromError(error: any): StannpError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: StannpErrorType; retryable: boolean }> = {
      '401': { type: StannpErrorType.Authentication, retryable: false },
      '429': { type: StannpErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new StannpError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = StannpErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = StannpErrorType.Authentication
    } else if (statusCode === 403) {
      type = StannpErrorType.Authorization
    } else if (statusCode === 404) {
      type = StannpErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = StannpErrorType.Validation
    } else if (statusCode === 429) {
      type = StannpErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = StannpErrorType.Server
      retryable = true
    }

    return new StannpError(message, code, type, {
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
    return this.type === StannpErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === StannpErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === StannpErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === StannpErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === StannpErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === StannpErrorType.Server
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

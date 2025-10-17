/**
 * Hystruct Errors
 *
 * Auto-generated error handling for Hystruct Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/hystruct
 */

/**
 * Error type enum
 */
export enum HystructErrorType {
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
 * Hystruct Error class
 *
 * Custom error class for Hystruct Integration operations.
 */
export class HystructError extends Error {
  public readonly code: string | number
  public readonly type: HystructErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: HystructErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'HystructError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HystructError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns HystructError instance
   */
  static fromError(error: any): HystructError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: HystructErrorType; retryable: boolean }> = {
      '401': { type: HystructErrorType.Authentication, retryable: false },
      '429': { type: HystructErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new HystructError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = HystructErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = HystructErrorType.Authentication
    } else if (statusCode === 403) {
      type = HystructErrorType.Authorization
    } else if (statusCode === 404) {
      type = HystructErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = HystructErrorType.Validation
    } else if (statusCode === 429) {
      type = HystructErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = HystructErrorType.Server
      retryable = true
    }

    return new HystructError(message, code, type, {
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
    return this.type === HystructErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === HystructErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === HystructErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === HystructErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === HystructErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === HystructErrorType.Server
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

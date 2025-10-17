/**
 * Neon Errors
 *
 * Auto-generated error handling for Neon Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/neon
 */

/**
 * Error type enum
 */
export enum NeonErrorType {
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
 * Neon Error class
 *
 * Custom error class for Neon Integration operations.
 */
export class NeonError extends Error {
  public readonly code: string | number
  public readonly type: NeonErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: NeonErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'NeonError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NeonError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns NeonError instance
   */
  static fromError(error: any): NeonError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: NeonErrorType; retryable: boolean }> = {
      '401': { type: NeonErrorType.Authentication, retryable: false },
      '429': { type: NeonErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new NeonError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = NeonErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = NeonErrorType.Authentication
    } else if (statusCode === 403) {
      type = NeonErrorType.Authorization
    } else if (statusCode === 404) {
      type = NeonErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = NeonErrorType.Validation
    } else if (statusCode === 429) {
      type = NeonErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = NeonErrorType.Server
      retryable = true
    }

    return new NeonError(message, code, type, {
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
    return this.type === NeonErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === NeonErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === NeonErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === NeonErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === NeonErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === NeonErrorType.Server
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

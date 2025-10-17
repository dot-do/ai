/**
 * Metaphor Errors
 *
 * Auto-generated error handling for Metaphor Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/metaphor
 */

/**
 * Error type enum
 */
export enum MetaphorErrorType {
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
 * Metaphor Error class
 *
 * Custom error class for Metaphor Integration operations.
 */
export class MetaphorError extends Error {
  public readonly code: string | number
  public readonly type: MetaphorErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MetaphorErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MetaphorError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MetaphorError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MetaphorError instance
   */
  static fromError(error: any): MetaphorError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MetaphorErrorType; retryable: boolean }> = {
      '401': { type: MetaphorErrorType.Authentication, retryable: false },
      '429': { type: MetaphorErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MetaphorError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MetaphorErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MetaphorErrorType.Authentication
    } else if (statusCode === 403) {
      type = MetaphorErrorType.Authorization
    } else if (statusCode === 404) {
      type = MetaphorErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MetaphorErrorType.Validation
    } else if (statusCode === 429) {
      type = MetaphorErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MetaphorErrorType.Server
      retryable = true
    }

    return new MetaphorError(message, code, type, {
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
    return this.type === MetaphorErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MetaphorErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MetaphorErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MetaphorErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MetaphorErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MetaphorErrorType.Server
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

/**
 * Backendless Errors
 *
 * Auto-generated error handling for Backendless Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/backendless
 */

/**
 * Error type enum
 */
export enum BackendlessErrorType {
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
 * Backendless Error class
 *
 * Custom error class for Backendless Integration operations.
 */
export class BackendlessError extends Error {
  public readonly code: string | number
  public readonly type: BackendlessErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BackendlessErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BackendlessError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BackendlessError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BackendlessError instance
   */
  static fromError(error: any): BackendlessError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BackendlessErrorType; retryable: boolean }> = {
      '401': { type: BackendlessErrorType.Authentication, retryable: false },
      '429': { type: BackendlessErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BackendlessError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BackendlessErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BackendlessErrorType.Authentication
    } else if (statusCode === 403) {
      type = BackendlessErrorType.Authorization
    } else if (statusCode === 404) {
      type = BackendlessErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BackendlessErrorType.Validation
    } else if (statusCode === 429) {
      type = BackendlessErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BackendlessErrorType.Server
      retryable = true
    }

    return new BackendlessError(message, code, type, {
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
    return this.type === BackendlessErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BackendlessErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BackendlessErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BackendlessErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BackendlessErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BackendlessErrorType.Server
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

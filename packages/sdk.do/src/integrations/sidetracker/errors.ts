/**
 * Sidetracker Errors
 *
 * Auto-generated error handling for Sidetracker Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sidetracker
 */

/**
 * Error type enum
 */
export enum SidetrackerErrorType {
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
 * Sidetracker Error class
 *
 * Custom error class for Sidetracker Integration operations.
 */
export class SidetrackerError extends Error {
  public readonly code: string | number
  public readonly type: SidetrackerErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SidetrackerErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SidetrackerError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SidetrackerError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SidetrackerError instance
   */
  static fromError(error: any): SidetrackerError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SidetrackerErrorType; retryable: boolean }> = {
      '401': { type: SidetrackerErrorType.Authentication, retryable: false },
      '429': { type: SidetrackerErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SidetrackerError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SidetrackerErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SidetrackerErrorType.Authentication
    } else if (statusCode === 403) {
      type = SidetrackerErrorType.Authorization
    } else if (statusCode === 404) {
      type = SidetrackerErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SidetrackerErrorType.Validation
    } else if (statusCode === 429) {
      type = SidetrackerErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SidetrackerErrorType.Server
      retryable = true
    }

    return new SidetrackerError(message, code, type, {
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
    return this.type === SidetrackerErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SidetrackerErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SidetrackerErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SidetrackerErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SidetrackerErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SidetrackerErrorType.Server
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

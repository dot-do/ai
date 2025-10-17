/**
 * Sage Errors
 *
 * Auto-generated error handling for Sage Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sage
 */

/**
 * Error type enum
 */
export enum SageErrorType {
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
 * Sage Error class
 *
 * Custom error class for Sage Integration operations.
 */
export class SageError extends Error {
  public readonly code: string | number
  public readonly type: SageErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SageErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SageError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SageError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SageError instance
   */
  static fromError(error: any): SageError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SageErrorType; retryable: boolean }> = {
      '401': { type: SageErrorType.Authentication, retryable: false },
      '429': { type: SageErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SageError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SageErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SageErrorType.Authentication
    } else if (statusCode === 403) {
      type = SageErrorType.Authorization
    } else if (statusCode === 404) {
      type = SageErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SageErrorType.Validation
    } else if (statusCode === 429) {
      type = SageErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SageErrorType.Server
      retryable = true
    }

    return new SageError(message, code, type, {
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
    return this.type === SageErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SageErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SageErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SageErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SageErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SageErrorType.Server
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

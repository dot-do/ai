/**
 * Remove bg Errors
 *
 * Auto-generated error handling for Remove bg Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/remove_bg
 */

/**
 * Error type enum
 */
export enum RemoveBgErrorType {
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
 * Remove bg Error class
 *
 * Custom error class for Remove bg Integration operations.
 */
export class RemoveBgError extends Error {
  public readonly code: string | number
  public readonly type: RemoveBgErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RemoveBgErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RemoveBgError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RemoveBgError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RemoveBgError instance
   */
  static fromError(error: any): RemoveBgError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RemoveBgErrorType; retryable: boolean }> = {
      '401': { type: RemoveBgErrorType.Authentication, retryable: false },
      '429': { type: RemoveBgErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RemoveBgError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RemoveBgErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RemoveBgErrorType.Authentication
    } else if (statusCode === 403) {
      type = RemoveBgErrorType.Authorization
    } else if (statusCode === 404) {
      type = RemoveBgErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RemoveBgErrorType.Validation
    } else if (statusCode === 429) {
      type = RemoveBgErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RemoveBgErrorType.Server
      retryable = true
    }

    return new RemoveBgError(message, code, type, {
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
    return this.type === RemoveBgErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RemoveBgErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RemoveBgErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RemoveBgErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RemoveBgErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RemoveBgErrorType.Server
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

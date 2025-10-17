/**
 * Fullenrich Errors
 *
 * Auto-generated error handling for Fullenrich Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/fullenrich
 */

/**
 * Error type enum
 */
export enum FullenrichErrorType {
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
 * Fullenrich Error class
 *
 * Custom error class for Fullenrich Integration operations.
 */
export class FullenrichError extends Error {
  public readonly code: string | number
  public readonly type: FullenrichErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FullenrichErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FullenrichError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FullenrichError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FullenrichError instance
   */
  static fromError(error: any): FullenrichError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FullenrichErrorType; retryable: boolean }> = {
      '401': { type: FullenrichErrorType.Authentication, retryable: false },
      '429': { type: FullenrichErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FullenrichError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FullenrichErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FullenrichErrorType.Authentication
    } else if (statusCode === 403) {
      type = FullenrichErrorType.Authorization
    } else if (statusCode === 404) {
      type = FullenrichErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FullenrichErrorType.Validation
    } else if (statusCode === 429) {
      type = FullenrichErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FullenrichErrorType.Server
      retryable = true
    }

    return new FullenrichError(message, code, type, {
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
    return this.type === FullenrichErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FullenrichErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FullenrichErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FullenrichErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FullenrichErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FullenrichErrorType.Server
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

/**
 * Confluence Errors
 *
 * Auto-generated error handling for Confluence Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/confluence
 */

/**
 * Error type enum
 */
export enum ConfluenceErrorType {
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
 * Confluence Error class
 *
 * Custom error class for Confluence Integration operations.
 */
export class ConfluenceError extends Error {
  public readonly code: string | number
  public readonly type: ConfluenceErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ConfluenceErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ConfluenceError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConfluenceError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ConfluenceError instance
   */
  static fromError(error: any): ConfluenceError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ConfluenceErrorType; retryable: boolean }> = {
      '401': { type: ConfluenceErrorType.Authentication, retryable: false },
      '429': { type: ConfluenceErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ConfluenceError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ConfluenceErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ConfluenceErrorType.Authentication
    } else if (statusCode === 403) {
      type = ConfluenceErrorType.Authorization
    } else if (statusCode === 404) {
      type = ConfluenceErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ConfluenceErrorType.Validation
    } else if (statusCode === 429) {
      type = ConfluenceErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ConfluenceErrorType.Server
      retryable = true
    }

    return new ConfluenceError(message, code, type, {
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
    return this.type === ConfluenceErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ConfluenceErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ConfluenceErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ConfluenceErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ConfluenceErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ConfluenceErrorType.Server
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

/**
 * Highlevel Errors
 *
 * Auto-generated error handling for Highlevel Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/highlevel
 */

/**
 * Error type enum
 */
export enum HighlevelErrorType {
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
 * Highlevel Error class
 *
 * Custom error class for Highlevel Integration operations.
 */
export class HighlevelError extends Error {
  public readonly code: string | number
  public readonly type: HighlevelErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: HighlevelErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'HighlevelError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HighlevelError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns HighlevelError instance
   */
  static fromError(error: any): HighlevelError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: HighlevelErrorType; retryable: boolean }> = {
      '401': { type: HighlevelErrorType.Authentication, retryable: false },
      '429': { type: HighlevelErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new HighlevelError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = HighlevelErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = HighlevelErrorType.Authentication
    } else if (statusCode === 403) {
      type = HighlevelErrorType.Authorization
    } else if (statusCode === 404) {
      type = HighlevelErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = HighlevelErrorType.Validation
    } else if (statusCode === 429) {
      type = HighlevelErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = HighlevelErrorType.Server
      retryable = true
    }

    return new HighlevelError(message, code, type, {
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
    return this.type === HighlevelErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === HighlevelErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === HighlevelErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === HighlevelErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === HighlevelErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === HighlevelErrorType.Server
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

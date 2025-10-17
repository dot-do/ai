/**
 * Parseur Errors
 *
 * Auto-generated error handling for Parseur Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/parseur
 */

/**
 * Error type enum
 */
export enum ParseurErrorType {
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
 * Parseur Error class
 *
 * Custom error class for Parseur Integration operations.
 */
export class ParseurError extends Error {
  public readonly code: string | number
  public readonly type: ParseurErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ParseurErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ParseurError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParseurError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ParseurError instance
   */
  static fromError(error: any): ParseurError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ParseurErrorType; retryable: boolean }> = {
      '401': { type: ParseurErrorType.Authentication, retryable: false },
      '429': { type: ParseurErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ParseurError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ParseurErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ParseurErrorType.Authentication
    } else if (statusCode === 403) {
      type = ParseurErrorType.Authorization
    } else if (statusCode === 404) {
      type = ParseurErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ParseurErrorType.Validation
    } else if (statusCode === 429) {
      type = ParseurErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ParseurErrorType.Server
      retryable = true
    }

    return new ParseurError(message, code, type, {
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
    return this.type === ParseurErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ParseurErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ParseurErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ParseurErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ParseurErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ParseurErrorType.Server
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

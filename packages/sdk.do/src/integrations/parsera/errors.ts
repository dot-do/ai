/**
 * Parsera Errors
 *
 * Auto-generated error handling for Parsera Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/parsera
 */

/**
 * Error type enum
 */
export enum ParseraErrorType {
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
 * Parsera Error class
 *
 * Custom error class for Parsera Integration operations.
 */
export class ParseraError extends Error {
  public readonly code: string | number
  public readonly type: ParseraErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ParseraErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ParseraError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParseraError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ParseraError instance
   */
  static fromError(error: any): ParseraError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ParseraErrorType; retryable: boolean }> = {
      '401': { type: ParseraErrorType.Authentication, retryable: false },
      '429': { type: ParseraErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ParseraError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ParseraErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ParseraErrorType.Authentication
    } else if (statusCode === 403) {
      type = ParseraErrorType.Authorization
    } else if (statusCode === 404) {
      type = ParseraErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ParseraErrorType.Validation
    } else if (statusCode === 429) {
      type = ParseraErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ParseraErrorType.Server
      retryable = true
    }

    return new ParseraError(message, code, type, {
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
    return this.type === ParseraErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ParseraErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ParseraErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ParseraErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ParseraErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ParseraErrorType.Server
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

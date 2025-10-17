/**
 * Google search console Errors
 *
 * Auto-generated error handling for Google search console Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/google_search_console
 */

/**
 * Error type enum
 */
export enum GoogleSearchConsoleErrorType {
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
 * Google search console Error class
 *
 * Custom error class for Google search console Integration operations.
 */
export class GoogleSearchConsoleError extends Error {
  public readonly code: string | number
  public readonly type: GoogleSearchConsoleErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GoogleSearchConsoleErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GoogleSearchConsoleError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GoogleSearchConsoleError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GoogleSearchConsoleError instance
   */
  static fromError(error: any): GoogleSearchConsoleError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GoogleSearchConsoleErrorType; retryable: boolean }> = {
      '401': { type: GoogleSearchConsoleErrorType.Authentication, retryable: false },
      '429': { type: GoogleSearchConsoleErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GoogleSearchConsoleError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GoogleSearchConsoleErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GoogleSearchConsoleErrorType.Authentication
    } else if (statusCode === 403) {
      type = GoogleSearchConsoleErrorType.Authorization
    } else if (statusCode === 404) {
      type = GoogleSearchConsoleErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GoogleSearchConsoleErrorType.Validation
    } else if (statusCode === 429) {
      type = GoogleSearchConsoleErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GoogleSearchConsoleErrorType.Server
      retryable = true
    }

    return new GoogleSearchConsoleError(message, code, type, {
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
    return this.type === GoogleSearchConsoleErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GoogleSearchConsoleErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GoogleSearchConsoleErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GoogleSearchConsoleErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GoogleSearchConsoleErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GoogleSearchConsoleErrorType.Server
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

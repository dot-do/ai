/**
 * Tavily Errors
 *
 * Auto-generated error handling for Tavily Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/tavily
 */

/**
 * Error type enum
 */
export enum TavilyErrorType {
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
 * Tavily Error class
 *
 * Custom error class for Tavily Integration operations.
 */
export class TavilyError extends Error {
  public readonly code: string | number
  public readonly type: TavilyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TavilyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TavilyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TavilyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TavilyError instance
   */
  static fromError(error: any): TavilyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TavilyErrorType; retryable: boolean }> = {
      '401': { type: TavilyErrorType.Authentication, retryable: false },
      '429': { type: TavilyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TavilyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TavilyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TavilyErrorType.Authentication
    } else if (statusCode === 403) {
      type = TavilyErrorType.Authorization
    } else if (statusCode === 404) {
      type = TavilyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TavilyErrorType.Validation
    } else if (statusCode === 429) {
      type = TavilyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TavilyErrorType.Server
      retryable = true
    }

    return new TavilyError(message, code, type, {
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
    return this.type === TavilyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TavilyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TavilyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TavilyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TavilyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TavilyErrorType.Server
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

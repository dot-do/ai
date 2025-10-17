/**
 * Scrapingant Errors
 *
 * Auto-generated error handling for Scrapingant Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/scrapingant
 */

/**
 * Error type enum
 */
export enum ScrapingantErrorType {
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
 * Scrapingant Error class
 *
 * Custom error class for Scrapingant Integration operations.
 */
export class ScrapingantError extends Error {
  public readonly code: string | number
  public readonly type: ScrapingantErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ScrapingantErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ScrapingantError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ScrapingantError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ScrapingantError instance
   */
  static fromError(error: any): ScrapingantError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ScrapingantErrorType; retryable: boolean }> = {
      '401': { type: ScrapingantErrorType.Authentication, retryable: false },
      '429': { type: ScrapingantErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ScrapingantError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ScrapingantErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ScrapingantErrorType.Authentication
    } else if (statusCode === 403) {
      type = ScrapingantErrorType.Authorization
    } else if (statusCode === 404) {
      type = ScrapingantErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ScrapingantErrorType.Validation
    } else if (statusCode === 429) {
      type = ScrapingantErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ScrapingantErrorType.Server
      retryable = true
    }

    return new ScrapingantError(message, code, type, {
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
    return this.type === ScrapingantErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ScrapingantErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ScrapingantErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ScrapingantErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ScrapingantErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ScrapingantErrorType.Server
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

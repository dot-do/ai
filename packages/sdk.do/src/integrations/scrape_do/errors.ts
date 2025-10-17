/**
 * Scrape do Errors
 *
 * Auto-generated error handling for Scrape do Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/scrape_do
 */

/**
 * Error type enum
 */
export enum ScrapeDoErrorType {
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
 * Scrape do Error class
 *
 * Custom error class for Scrape do Integration operations.
 */
export class ScrapeDoError extends Error {
  public readonly code: string | number
  public readonly type: ScrapeDoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ScrapeDoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ScrapeDoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ScrapeDoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ScrapeDoError instance
   */
  static fromError(error: any): ScrapeDoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ScrapeDoErrorType; retryable: boolean }> = {
      '401': { type: ScrapeDoErrorType.Authentication, retryable: false },
      '429': { type: ScrapeDoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ScrapeDoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ScrapeDoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ScrapeDoErrorType.Authentication
    } else if (statusCode === 403) {
      type = ScrapeDoErrorType.Authorization
    } else if (statusCode === 404) {
      type = ScrapeDoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ScrapeDoErrorType.Validation
    } else if (statusCode === 429) {
      type = ScrapeDoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ScrapeDoErrorType.Server
      retryable = true
    }

    return new ScrapeDoError(message, code, type, {
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
    return this.type === ScrapeDoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ScrapeDoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ScrapeDoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ScrapeDoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ScrapeDoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ScrapeDoErrorType.Server
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

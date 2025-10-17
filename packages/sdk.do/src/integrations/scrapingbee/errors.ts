/**
 * Scrapingbee Errors
 *
 * Auto-generated error handling for Scrapingbee Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/scrapingbee
 */

/**
 * Error type enum
 */
export enum ScrapingbeeErrorType {
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
 * Scrapingbee Error class
 *
 * Custom error class for Scrapingbee Integration operations.
 */
export class ScrapingbeeError extends Error {
  public readonly code: string | number
  public readonly type: ScrapingbeeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ScrapingbeeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ScrapingbeeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ScrapingbeeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ScrapingbeeError instance
   */
  static fromError(error: any): ScrapingbeeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ScrapingbeeErrorType; retryable: boolean }> = {
      '401': { type: ScrapingbeeErrorType.Authentication, retryable: false },
      '429': { type: ScrapingbeeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ScrapingbeeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ScrapingbeeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ScrapingbeeErrorType.Authentication
    } else if (statusCode === 403) {
      type = ScrapingbeeErrorType.Authorization
    } else if (statusCode === 404) {
      type = ScrapingbeeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ScrapingbeeErrorType.Validation
    } else if (statusCode === 429) {
      type = ScrapingbeeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ScrapingbeeErrorType.Server
      retryable = true
    }

    return new ScrapingbeeError(message, code, type, {
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
    return this.type === ScrapingbeeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ScrapingbeeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ScrapingbeeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ScrapingbeeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ScrapingbeeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ScrapingbeeErrorType.Server
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

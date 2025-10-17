/**
 * Webscraping ai Errors
 *
 * Auto-generated error handling for Webscraping ai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/webscraping_ai
 */

/**
 * Error type enum
 */
export enum WebscrapingAiErrorType {
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
 * Webscraping ai Error class
 *
 * Custom error class for Webscraping ai Integration operations.
 */
export class WebscrapingAiError extends Error {
  public readonly code: string | number
  public readonly type: WebscrapingAiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WebscrapingAiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WebscrapingAiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WebscrapingAiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WebscrapingAiError instance
   */
  static fromError(error: any): WebscrapingAiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WebscrapingAiErrorType; retryable: boolean }> = {
      '401': { type: WebscrapingAiErrorType.Authentication, retryable: false },
      '429': { type: WebscrapingAiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WebscrapingAiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WebscrapingAiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WebscrapingAiErrorType.Authentication
    } else if (statusCode === 403) {
      type = WebscrapingAiErrorType.Authorization
    } else if (statusCode === 404) {
      type = WebscrapingAiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WebscrapingAiErrorType.Validation
    } else if (statusCode === 429) {
      type = WebscrapingAiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WebscrapingAiErrorType.Server
      retryable = true
    }

    return new WebscrapingAiError(message, code, type, {
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
    return this.type === WebscrapingAiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WebscrapingAiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WebscrapingAiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WebscrapingAiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WebscrapingAiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WebscrapingAiErrorType.Server
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

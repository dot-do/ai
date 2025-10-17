/**
 * Browserless Errors
 *
 * Auto-generated error handling for Browserless Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/browserless
 */

/**
 * Error type enum
 */
export enum BrowserlessErrorType {
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
 * Browserless Error class
 *
 * Custom error class for Browserless Integration operations.
 */
export class BrowserlessError extends Error {
  public readonly code: string | number
  public readonly type: BrowserlessErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BrowserlessErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BrowserlessError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BrowserlessError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BrowserlessError instance
   */
  static fromError(error: any): BrowserlessError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BrowserlessErrorType; retryable: boolean }> = {
      '401': { type: BrowserlessErrorType.Authentication, retryable: false },
      '429': { type: BrowserlessErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BrowserlessError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BrowserlessErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BrowserlessErrorType.Authentication
    } else if (statusCode === 403) {
      type = BrowserlessErrorType.Authorization
    } else if (statusCode === 404) {
      type = BrowserlessErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BrowserlessErrorType.Validation
    } else if (statusCode === 429) {
      type = BrowserlessErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BrowserlessErrorType.Server
      retryable = true
    }

    return new BrowserlessError(message, code, type, {
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
    return this.type === BrowserlessErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BrowserlessErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BrowserlessErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BrowserlessErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BrowserlessErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BrowserlessErrorType.Server
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

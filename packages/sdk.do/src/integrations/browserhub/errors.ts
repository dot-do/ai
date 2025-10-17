/**
 * Browserhub Errors
 *
 * Auto-generated error handling for Browserhub Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/browserhub
 */

/**
 * Error type enum
 */
export enum BrowserhubErrorType {
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
 * Browserhub Error class
 *
 * Custom error class for Browserhub Integration operations.
 */
export class BrowserhubError extends Error {
  public readonly code: string | number
  public readonly type: BrowserhubErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BrowserhubErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BrowserhubError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BrowserhubError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BrowserhubError instance
   */
  static fromError(error: any): BrowserhubError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BrowserhubErrorType; retryable: boolean }> = {
      '401': { type: BrowserhubErrorType.Authentication, retryable: false },
      '429': { type: BrowserhubErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BrowserhubError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BrowserhubErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BrowserhubErrorType.Authentication
    } else if (statusCode === 403) {
      type = BrowserhubErrorType.Authorization
    } else if (statusCode === 404) {
      type = BrowserhubErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BrowserhubErrorType.Validation
    } else if (statusCode === 429) {
      type = BrowserhubErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BrowserhubErrorType.Server
      retryable = true
    }

    return new BrowserhubError(message, code, type, {
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
    return this.type === BrowserhubErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BrowserhubErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BrowserhubErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BrowserhubErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BrowserhubErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BrowserhubErrorType.Server
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

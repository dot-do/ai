/**
 * Webflow Errors
 *
 * Auto-generated error handling for Webflow Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/webflow
 */

/**
 * Error type enum
 */
export enum WebflowErrorType {
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
 * Webflow Error class
 *
 * Custom error class for Webflow Integration operations.
 */
export class WebflowError extends Error {
  public readonly code: string | number
  public readonly type: WebflowErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WebflowErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WebflowError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WebflowError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WebflowError instance
   */
  static fromError(error: any): WebflowError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WebflowErrorType; retryable: boolean }> = {
      '401': { type: WebflowErrorType.Authentication, retryable: false },
      '429': { type: WebflowErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WebflowError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WebflowErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WebflowErrorType.Authentication
    } else if (statusCode === 403) {
      type = WebflowErrorType.Authorization
    } else if (statusCode === 404) {
      type = WebflowErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WebflowErrorType.Validation
    } else if (statusCode === 429) {
      type = WebflowErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WebflowErrorType.Server
      retryable = true
    }

    return new WebflowError(message, code, type, {
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
    return this.type === WebflowErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WebflowErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WebflowErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WebflowErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WebflowErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WebflowErrorType.Server
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

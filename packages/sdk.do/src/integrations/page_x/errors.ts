/**
 * Page x Errors
 *
 * Auto-generated error handling for Page x Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/page_x
 */

/**
 * Error type enum
 */
export enum PageXErrorType {
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
 * Page x Error class
 *
 * Custom error class for Page x Integration operations.
 */
export class PageXError extends Error {
  public readonly code: string | number
  public readonly type: PageXErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PageXErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PageXError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PageXError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PageXError instance
   */
  static fromError(error: any): PageXError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PageXErrorType; retryable: boolean }> = {
      '401': { type: PageXErrorType.Authentication, retryable: false },
      '429': { type: PageXErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PageXError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PageXErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PageXErrorType.Authentication
    } else if (statusCode === 403) {
      type = PageXErrorType.Authorization
    } else if (statusCode === 404) {
      type = PageXErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PageXErrorType.Validation
    } else if (statusCode === 429) {
      type = PageXErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PageXErrorType.Server
      retryable = true
    }

    return new PageXError(message, code, type, {
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
    return this.type === PageXErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PageXErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PageXErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PageXErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PageXErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PageXErrorType.Server
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

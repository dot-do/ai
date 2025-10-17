/**
 * Webvizio Errors
 *
 * Auto-generated error handling for Webvizio Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/webvizio
 */

/**
 * Error type enum
 */
export enum WebvizioErrorType {
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
 * Webvizio Error class
 *
 * Custom error class for Webvizio Integration operations.
 */
export class WebvizioError extends Error {
  public readonly code: string | number
  public readonly type: WebvizioErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WebvizioErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WebvizioError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WebvizioError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WebvizioError instance
   */
  static fromError(error: any): WebvizioError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WebvizioErrorType; retryable: boolean }> = {
      '401': { type: WebvizioErrorType.Authentication, retryable: false },
      '429': { type: WebvizioErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WebvizioError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WebvizioErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WebvizioErrorType.Authentication
    } else if (statusCode === 403) {
      type = WebvizioErrorType.Authorization
    } else if (statusCode === 404) {
      type = WebvizioErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WebvizioErrorType.Validation
    } else if (statusCode === 429) {
      type = WebvizioErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WebvizioErrorType.Server
      retryable = true
    }

    return new WebvizioError(message, code, type, {
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
    return this.type === WebvizioErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WebvizioErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WebvizioErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WebvizioErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WebvizioErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WebvizioErrorType.Server
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

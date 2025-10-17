/**
 * Anchor browser Errors
 *
 * Auto-generated error handling for Anchor browser Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/anchor_browser
 */

/**
 * Error type enum
 */
export enum AnchorBrowserErrorType {
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
 * Anchor browser Error class
 *
 * Custom error class for Anchor browser Integration operations.
 */
export class AnchorBrowserError extends Error {
  public readonly code: string | number
  public readonly type: AnchorBrowserErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AnchorBrowserErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AnchorBrowserError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AnchorBrowserError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AnchorBrowserError instance
   */
  static fromError(error: any): AnchorBrowserError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AnchorBrowserErrorType; retryable: boolean }> = {
      '401': { type: AnchorBrowserErrorType.Authentication, retryable: false },
      '429': { type: AnchorBrowserErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AnchorBrowserError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AnchorBrowserErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AnchorBrowserErrorType.Authentication
    } else if (statusCode === 403) {
      type = AnchorBrowserErrorType.Authorization
    } else if (statusCode === 404) {
      type = AnchorBrowserErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AnchorBrowserErrorType.Validation
    } else if (statusCode === 429) {
      type = AnchorBrowserErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AnchorBrowserErrorType.Server
      retryable = true
    }

    return new AnchorBrowserError(message, code, type, {
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
    return this.type === AnchorBrowserErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AnchorBrowserErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AnchorBrowserErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AnchorBrowserErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AnchorBrowserErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AnchorBrowserErrorType.Server
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

/**
 * Go to webinar Errors
 *
 * Auto-generated error handling for Go to webinar Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/go_to_webinar
 */

/**
 * Error type enum
 */
export enum GoToWebinarErrorType {
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
 * Go to webinar Error class
 *
 * Custom error class for Go to webinar Integration operations.
 */
export class GoToWebinarError extends Error {
  public readonly code: string | number
  public readonly type: GoToWebinarErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GoToWebinarErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GoToWebinarError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GoToWebinarError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GoToWebinarError instance
   */
  static fromError(error: any): GoToWebinarError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GoToWebinarErrorType; retryable: boolean }> = {
      '401': { type: GoToWebinarErrorType.Authentication, retryable: false },
      '429': { type: GoToWebinarErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GoToWebinarError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GoToWebinarErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GoToWebinarErrorType.Authentication
    } else if (statusCode === 403) {
      type = GoToWebinarErrorType.Authorization
    } else if (statusCode === 404) {
      type = GoToWebinarErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GoToWebinarErrorType.Validation
    } else if (statusCode === 429) {
      type = GoToWebinarErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GoToWebinarErrorType.Server
      retryable = true
    }

    return new GoToWebinarError(message, code, type, {
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
    return this.type === GoToWebinarErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GoToWebinarErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GoToWebinarErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GoToWebinarErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GoToWebinarErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GoToWebinarErrorType.Server
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

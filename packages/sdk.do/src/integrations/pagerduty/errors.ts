/**
 * Pagerduty Errors
 *
 * Auto-generated error handling for Pagerduty Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/pagerduty
 */

/**
 * Error type enum
 */
export enum PagerdutyErrorType {
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
 * Pagerduty Error class
 *
 * Custom error class for Pagerduty Integration operations.
 */
export class PagerdutyError extends Error {
  public readonly code: string | number
  public readonly type: PagerdutyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PagerdutyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PagerdutyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PagerdutyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PagerdutyError instance
   */
  static fromError(error: any): PagerdutyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PagerdutyErrorType; retryable: boolean }> = {
      '401': { type: PagerdutyErrorType.Authentication, retryable: false },
      '429': { type: PagerdutyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PagerdutyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PagerdutyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PagerdutyErrorType.Authentication
    } else if (statusCode === 403) {
      type = PagerdutyErrorType.Authorization
    } else if (statusCode === 404) {
      type = PagerdutyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PagerdutyErrorType.Validation
    } else if (statusCode === 429) {
      type = PagerdutyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PagerdutyErrorType.Server
      retryable = true
    }

    return new PagerdutyError(message, code, type, {
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
    return this.type === PagerdutyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PagerdutyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PagerdutyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PagerdutyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PagerdutyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PagerdutyErrorType.Server
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

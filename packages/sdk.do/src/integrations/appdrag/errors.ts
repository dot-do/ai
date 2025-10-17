/**
 * Appdrag Errors
 *
 * Auto-generated error handling for Appdrag Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/appdrag
 */

/**
 * Error type enum
 */
export enum AppdragErrorType {
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
 * Appdrag Error class
 *
 * Custom error class for Appdrag Integration operations.
 */
export class AppdragError extends Error {
  public readonly code: string | number
  public readonly type: AppdragErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AppdragErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AppdragError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppdragError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AppdragError instance
   */
  static fromError(error: any): AppdragError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AppdragErrorType; retryable: boolean }> = {
      '401': { type: AppdragErrorType.Authentication, retryable: false },
      '429': { type: AppdragErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AppdragError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AppdragErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AppdragErrorType.Authentication
    } else if (statusCode === 403) {
      type = AppdragErrorType.Authorization
    } else if (statusCode === 404) {
      type = AppdragErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AppdragErrorType.Validation
    } else if (statusCode === 429) {
      type = AppdragErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AppdragErrorType.Server
      retryable = true
    }

    return new AppdragError(message, code, type, {
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
    return this.type === AppdragErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AppdragErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AppdragErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AppdragErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AppdragErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AppdragErrorType.Server
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

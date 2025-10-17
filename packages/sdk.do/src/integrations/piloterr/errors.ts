/**
 * Piloterr Errors
 *
 * Auto-generated error handling for Piloterr Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/piloterr
 */

/**
 * Error type enum
 */
export enum PiloterrErrorType {
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
 * Piloterr Error class
 *
 * Custom error class for Piloterr Integration operations.
 */
export class PiloterrError extends Error {
  public readonly code: string | number
  public readonly type: PiloterrErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PiloterrErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PiloterrError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PiloterrError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PiloterrError instance
   */
  static fromError(error: any): PiloterrError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PiloterrErrorType; retryable: boolean }> = {
      '401': { type: PiloterrErrorType.Authentication, retryable: false },
      '429': { type: PiloterrErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PiloterrError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PiloterrErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PiloterrErrorType.Authentication
    } else if (statusCode === 403) {
      type = PiloterrErrorType.Authorization
    } else if (statusCode === 404) {
      type = PiloterrErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PiloterrErrorType.Validation
    } else if (statusCode === 429) {
      type = PiloterrErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PiloterrErrorType.Server
      retryable = true
    }

    return new PiloterrError(message, code, type, {
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
    return this.type === PiloterrErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PiloterrErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PiloterrErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PiloterrErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PiloterrErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PiloterrErrorType.Server
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

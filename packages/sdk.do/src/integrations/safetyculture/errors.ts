/**
 * Safetyculture Errors
 *
 * Auto-generated error handling for Safetyculture Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/safetyculture
 */

/**
 * Error type enum
 */
export enum SafetycultureErrorType {
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
 * Safetyculture Error class
 *
 * Custom error class for Safetyculture Integration operations.
 */
export class SafetycultureError extends Error {
  public readonly code: string | number
  public readonly type: SafetycultureErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SafetycultureErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SafetycultureError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SafetycultureError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SafetycultureError instance
   */
  static fromError(error: any): SafetycultureError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SafetycultureErrorType; retryable: boolean }> = {
      '401': { type: SafetycultureErrorType.Authentication, retryable: false },
      '429': { type: SafetycultureErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SafetycultureError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SafetycultureErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SafetycultureErrorType.Authentication
    } else if (statusCode === 403) {
      type = SafetycultureErrorType.Authorization
    } else if (statusCode === 404) {
      type = SafetycultureErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SafetycultureErrorType.Validation
    } else if (statusCode === 429) {
      type = SafetycultureErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SafetycultureErrorType.Server
      retryable = true
    }

    return new SafetycultureError(message, code, type, {
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
    return this.type === SafetycultureErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SafetycultureErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SafetycultureErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SafetycultureErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SafetycultureErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SafetycultureErrorType.Server
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

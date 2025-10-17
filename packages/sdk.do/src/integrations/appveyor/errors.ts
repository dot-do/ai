/**
 * Appveyor Errors
 *
 * Auto-generated error handling for Appveyor Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/appveyor
 */

/**
 * Error type enum
 */
export enum AppveyorErrorType {
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
 * Appveyor Error class
 *
 * Custom error class for Appveyor Integration operations.
 */
export class AppveyorError extends Error {
  public readonly code: string | number
  public readonly type: AppveyorErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AppveyorErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AppveyorError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppveyorError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AppveyorError instance
   */
  static fromError(error: any): AppveyorError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AppveyorErrorType; retryable: boolean }> = {
      '401': { type: AppveyorErrorType.Authentication, retryable: false },
      '429': { type: AppveyorErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AppveyorError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AppveyorErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AppveyorErrorType.Authentication
    } else if (statusCode === 403) {
      type = AppveyorErrorType.Authorization
    } else if (statusCode === 404) {
      type = AppveyorErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AppveyorErrorType.Validation
    } else if (statusCode === 429) {
      type = AppveyorErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AppveyorErrorType.Server
      retryable = true
    }

    return new AppveyorError(message, code, type, {
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
    return this.type === AppveyorErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AppveyorErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AppveyorErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AppveyorErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AppveyorErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AppveyorErrorType.Server
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

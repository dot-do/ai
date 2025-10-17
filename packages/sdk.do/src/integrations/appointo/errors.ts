/**
 * Appointo Errors
 *
 * Auto-generated error handling for Appointo Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/appointo
 */

/**
 * Error type enum
 */
export enum AppointoErrorType {
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
 * Appointo Error class
 *
 * Custom error class for Appointo Integration operations.
 */
export class AppointoError extends Error {
  public readonly code: string | number
  public readonly type: AppointoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AppointoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AppointoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppointoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AppointoError instance
   */
  static fromError(error: any): AppointoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AppointoErrorType; retryable: boolean }> = {
      '401': { type: AppointoErrorType.Authentication, retryable: false },
      '429': { type: AppointoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AppointoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AppointoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AppointoErrorType.Authentication
    } else if (statusCode === 403) {
      type = AppointoErrorType.Authorization
    } else if (statusCode === 404) {
      type = AppointoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AppointoErrorType.Validation
    } else if (statusCode === 429) {
      type = AppointoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AppointoErrorType.Server
      retryable = true
    }

    return new AppointoError(message, code, type, {
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
    return this.type === AppointoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AppointoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AppointoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AppointoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AppointoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AppointoErrorType.Server
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

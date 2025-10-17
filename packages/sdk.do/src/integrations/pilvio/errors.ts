/**
 * Pilvio Errors
 *
 * Auto-generated error handling for Pilvio Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/pilvio
 */

/**
 * Error type enum
 */
export enum PilvioErrorType {
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
 * Pilvio Error class
 *
 * Custom error class for Pilvio Integration operations.
 */
export class PilvioError extends Error {
  public readonly code: string | number
  public readonly type: PilvioErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PilvioErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PilvioError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PilvioError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PilvioError instance
   */
  static fromError(error: any): PilvioError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PilvioErrorType; retryable: boolean }> = {
      '401': { type: PilvioErrorType.Authentication, retryable: false },
      '429': { type: PilvioErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PilvioError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PilvioErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PilvioErrorType.Authentication
    } else if (statusCode === 403) {
      type = PilvioErrorType.Authorization
    } else if (statusCode === 404) {
      type = PilvioErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PilvioErrorType.Validation
    } else if (statusCode === 429) {
      type = PilvioErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PilvioErrorType.Server
      retryable = true
    }

    return new PilvioError(message, code, type, {
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
    return this.type === PilvioErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PilvioErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PilvioErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PilvioErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PilvioErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PilvioErrorType.Server
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

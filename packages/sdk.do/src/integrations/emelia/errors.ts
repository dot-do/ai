/**
 * Emelia Errors
 *
 * Auto-generated error handling for Emelia Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/emelia
 */

/**
 * Error type enum
 */
export enum EmeliaErrorType {
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
 * Emelia Error class
 *
 * Custom error class for Emelia Integration operations.
 */
export class EmeliaError extends Error {
  public readonly code: string | number
  public readonly type: EmeliaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: EmeliaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'EmeliaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EmeliaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns EmeliaError instance
   */
  static fromError(error: any): EmeliaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: EmeliaErrorType; retryable: boolean }> = {
      '401': { type: EmeliaErrorType.Authentication, retryable: false },
      '429': { type: EmeliaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new EmeliaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = EmeliaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = EmeliaErrorType.Authentication
    } else if (statusCode === 403) {
      type = EmeliaErrorType.Authorization
    } else if (statusCode === 404) {
      type = EmeliaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = EmeliaErrorType.Validation
    } else if (statusCode === 429) {
      type = EmeliaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = EmeliaErrorType.Server
      retryable = true
    }

    return new EmeliaError(message, code, type, {
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
    return this.type === EmeliaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === EmeliaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === EmeliaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === EmeliaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === EmeliaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === EmeliaErrorType.Server
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

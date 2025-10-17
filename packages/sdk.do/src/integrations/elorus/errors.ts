/**
 * Elorus Errors
 *
 * Auto-generated error handling for Elorus Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/elorus
 */

/**
 * Error type enum
 */
export enum ElorusErrorType {
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
 * Elorus Error class
 *
 * Custom error class for Elorus Integration operations.
 */
export class ElorusError extends Error {
  public readonly code: string | number
  public readonly type: ElorusErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ElorusErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ElorusError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ElorusError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ElorusError instance
   */
  static fromError(error: any): ElorusError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ElorusErrorType; retryable: boolean }> = {
      '401': { type: ElorusErrorType.Authentication, retryable: false },
      '429': { type: ElorusErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ElorusError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ElorusErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ElorusErrorType.Authentication
    } else if (statusCode === 403) {
      type = ElorusErrorType.Authorization
    } else if (statusCode === 404) {
      type = ElorusErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ElorusErrorType.Validation
    } else if (statusCode === 429) {
      type = ElorusErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ElorusErrorType.Server
      retryable = true
    }

    return new ElorusError(message, code, type, {
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
    return this.type === ElorusErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ElorusErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ElorusErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ElorusErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ElorusErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ElorusErrorType.Server
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

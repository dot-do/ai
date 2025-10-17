/**
 * Chaser Errors
 *
 * Auto-generated error handling for Chaser Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/chaser
 */

/**
 * Error type enum
 */
export enum ChaserErrorType {
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
 * Chaser Error class
 *
 * Custom error class for Chaser Integration operations.
 */
export class ChaserError extends Error {
  public readonly code: string | number
  public readonly type: ChaserErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ChaserErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ChaserError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ChaserError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ChaserError instance
   */
  static fromError(error: any): ChaserError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ChaserErrorType; retryable: boolean }> = {
      '401': { type: ChaserErrorType.Authentication, retryable: false },
      '429': { type: ChaserErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ChaserError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ChaserErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ChaserErrorType.Authentication
    } else if (statusCode === 403) {
      type = ChaserErrorType.Authorization
    } else if (statusCode === 404) {
      type = ChaserErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ChaserErrorType.Validation
    } else if (statusCode === 429) {
      type = ChaserErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ChaserErrorType.Server
      retryable = true
    }

    return new ChaserError(message, code, type, {
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
    return this.type === ChaserErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ChaserErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ChaserErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ChaserErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ChaserErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ChaserErrorType.Server
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

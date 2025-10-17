/**
 * Bolna Errors
 *
 * Auto-generated error handling for Bolna Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bolna
 */

/**
 * Error type enum
 */
export enum BolnaErrorType {
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
 * Bolna Error class
 *
 * Custom error class for Bolna Integration operations.
 */
export class BolnaError extends Error {
  public readonly code: string | number
  public readonly type: BolnaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BolnaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BolnaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BolnaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BolnaError instance
   */
  static fromError(error: any): BolnaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BolnaErrorType; retryable: boolean }> = {
      '401': { type: BolnaErrorType.Authentication, retryable: false },
      '429': { type: BolnaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BolnaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BolnaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BolnaErrorType.Authentication
    } else if (statusCode === 403) {
      type = BolnaErrorType.Authorization
    } else if (statusCode === 404) {
      type = BolnaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BolnaErrorType.Validation
    } else if (statusCode === 429) {
      type = BolnaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BolnaErrorType.Server
      retryable = true
    }

    return new BolnaError(message, code, type, {
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
    return this.type === BolnaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BolnaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BolnaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BolnaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BolnaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BolnaErrorType.Server
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

/**
 * Bannerbear Errors
 *
 * Auto-generated error handling for Bannerbear Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bannerbear
 */

/**
 * Error type enum
 */
export enum BannerbearErrorType {
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
 * Bannerbear Error class
 *
 * Custom error class for Bannerbear Integration operations.
 */
export class BannerbearError extends Error {
  public readonly code: string | number
  public readonly type: BannerbearErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BannerbearErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BannerbearError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BannerbearError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BannerbearError instance
   */
  static fromError(error: any): BannerbearError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BannerbearErrorType; retryable: boolean }> = {
      '401': { type: BannerbearErrorType.Authentication, retryable: false },
      '429': { type: BannerbearErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BannerbearError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BannerbearErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BannerbearErrorType.Authentication
    } else if (statusCode === 403) {
      type = BannerbearErrorType.Authorization
    } else if (statusCode === 404) {
      type = BannerbearErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BannerbearErrorType.Validation
    } else if (statusCode === 429) {
      type = BannerbearErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BannerbearErrorType.Server
      retryable = true
    }

    return new BannerbearError(message, code, type, {
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
    return this.type === BannerbearErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BannerbearErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BannerbearErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BannerbearErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BannerbearErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BannerbearErrorType.Server
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

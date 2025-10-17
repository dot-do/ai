/**
 * Brandfetch Errors
 *
 * Auto-generated error handling for Brandfetch Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/brandfetch
 */

/**
 * Error type enum
 */
export enum BrandfetchErrorType {
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
 * Brandfetch Error class
 *
 * Custom error class for Brandfetch Integration operations.
 */
export class BrandfetchError extends Error {
  public readonly code: string | number
  public readonly type: BrandfetchErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BrandfetchErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BrandfetchError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BrandfetchError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BrandfetchError instance
   */
  static fromError(error: any): BrandfetchError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BrandfetchErrorType; retryable: boolean }> = {
      '401': { type: BrandfetchErrorType.Authentication, retryable: false },
      '429': { type: BrandfetchErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BrandfetchError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BrandfetchErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BrandfetchErrorType.Authentication
    } else if (statusCode === 403) {
      type = BrandfetchErrorType.Authorization
    } else if (statusCode === 404) {
      type = BrandfetchErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BrandfetchErrorType.Validation
    } else if (statusCode === 429) {
      type = BrandfetchErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BrandfetchErrorType.Server
      retryable = true
    }

    return new BrandfetchError(message, code, type, {
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
    return this.type === BrandfetchErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BrandfetchErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BrandfetchErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BrandfetchErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BrandfetchErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BrandfetchErrorType.Server
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

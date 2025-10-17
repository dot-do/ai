/**
 * Bunnycdn Errors
 *
 * Auto-generated error handling for Bunnycdn Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bunnycdn
 */

/**
 * Error type enum
 */
export enum BunnycdnErrorType {
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
 * Bunnycdn Error class
 *
 * Custom error class for Bunnycdn Integration operations.
 */
export class BunnycdnError extends Error {
  public readonly code: string | number
  public readonly type: BunnycdnErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BunnycdnErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BunnycdnError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BunnycdnError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BunnycdnError instance
   */
  static fromError(error: any): BunnycdnError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BunnycdnErrorType; retryable: boolean }> = {
      '401': { type: BunnycdnErrorType.Authentication, retryable: false },
      '429': { type: BunnycdnErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BunnycdnError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BunnycdnErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BunnycdnErrorType.Authentication
    } else if (statusCode === 403) {
      type = BunnycdnErrorType.Authorization
    } else if (statusCode === 404) {
      type = BunnycdnErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BunnycdnErrorType.Validation
    } else if (statusCode === 429) {
      type = BunnycdnErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BunnycdnErrorType.Server
      retryable = true
    }

    return new BunnycdnError(message, code, type, {
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
    return this.type === BunnycdnErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BunnycdnErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BunnycdnErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BunnycdnErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BunnycdnErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BunnycdnErrorType.Server
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

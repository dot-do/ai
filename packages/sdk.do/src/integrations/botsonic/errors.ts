/**
 * Botsonic Errors
 *
 * Auto-generated error handling for Botsonic Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/botsonic
 */

/**
 * Error type enum
 */
export enum BotsonicErrorType {
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
 * Botsonic Error class
 *
 * Custom error class for Botsonic Integration operations.
 */
export class BotsonicError extends Error {
  public readonly code: string | number
  public readonly type: BotsonicErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BotsonicErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BotsonicError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BotsonicError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BotsonicError instance
   */
  static fromError(error: any): BotsonicError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BotsonicErrorType; retryable: boolean }> = {
      '401': { type: BotsonicErrorType.Authentication, retryable: false },
      '429': { type: BotsonicErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BotsonicError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BotsonicErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BotsonicErrorType.Authentication
    } else if (statusCode === 403) {
      type = BotsonicErrorType.Authorization
    } else if (statusCode === 404) {
      type = BotsonicErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BotsonicErrorType.Validation
    } else if (statusCode === 429) {
      type = BotsonicErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BotsonicErrorType.Server
      retryable = true
    }

    return new BotsonicError(message, code, type, {
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
    return this.type === BotsonicErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BotsonicErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BotsonicErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BotsonicErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BotsonicErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BotsonicErrorType.Server
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

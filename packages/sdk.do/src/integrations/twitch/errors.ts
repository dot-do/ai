/**
 * Twitch Errors
 *
 * Auto-generated error handling for Twitch Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/twitch
 */

/**
 * Error type enum
 */
export enum TwitchErrorType {
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
 * Twitch Error class
 *
 * Custom error class for Twitch Integration operations.
 */
export class TwitchError extends Error {
  public readonly code: string | number
  public readonly type: TwitchErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TwitchErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TwitchError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TwitchError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TwitchError instance
   */
  static fromError(error: any): TwitchError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TwitchErrorType; retryable: boolean }> = {
      '401': { type: TwitchErrorType.Authentication, retryable: false },
      '429': { type: TwitchErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TwitchError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TwitchErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TwitchErrorType.Authentication
    } else if (statusCode === 403) {
      type = TwitchErrorType.Authorization
    } else if (statusCode === 404) {
      type = TwitchErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TwitchErrorType.Validation
    } else if (statusCode === 429) {
      type = TwitchErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TwitchErrorType.Server
      retryable = true
    }

    return new TwitchError(message, code, type, {
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
    return this.type === TwitchErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TwitchErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TwitchErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TwitchErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TwitchErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TwitchErrorType.Server
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

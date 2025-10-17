/**
 * Discord Errors
 *
 * Auto-generated error handling for Discord Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/discord
 */

/**
 * Error type enum
 */
export enum DiscordErrorType {
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
 * Discord Error class
 *
 * Custom error class for Discord Integration operations.
 */
export class DiscordError extends Error {
  public readonly code: string | number
  public readonly type: DiscordErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DiscordErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DiscordError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DiscordError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DiscordError instance
   */
  static fromError(error: any): DiscordError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DiscordErrorType; retryable: boolean }> = {
      '10003': { type: DiscordErrorType.NotFound, retryable: false },
      '10004': { type: DiscordErrorType.NotFound, retryable: false },
      '10008': { type: DiscordErrorType.NotFound, retryable: false },
      '10013': { type: DiscordErrorType.NotFound, retryable: false },
      '20001': { type: DiscordErrorType.Validation, retryable: false },
      '30001': { type: DiscordErrorType.RateLimit, retryable: false },
      '30003': { type: DiscordErrorType.RateLimit, retryable: false },
      '40001': { type: DiscordErrorType.Authentication, retryable: false },
      '40002': { type: DiscordErrorType.Validation, retryable: false },
      '50001': { type: DiscordErrorType.Authorization, retryable: false },
      '50013': { type: DiscordErrorType.Authorization, retryable: false },
      '160002': { type: DiscordErrorType.Validation, retryable: false },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DiscordError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DiscordErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DiscordErrorType.Authentication
    } else if (statusCode === 403) {
      type = DiscordErrorType.Authorization
    } else if (statusCode === 404) {
      type = DiscordErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DiscordErrorType.Validation
    } else if (statusCode === 429) {
      type = DiscordErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DiscordErrorType.Server
      retryable = true
    }

    return new DiscordError(message, code, type, {
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
    return this.type === DiscordErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DiscordErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DiscordErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DiscordErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DiscordErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DiscordErrorType.Server
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

/**
 * Botstar Errors
 *
 * Auto-generated error handling for Botstar Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/botstar
 */

/**
 * Error type enum
 */
export enum BotstarErrorType {
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
 * Botstar Error class
 *
 * Custom error class for Botstar Integration operations.
 */
export class BotstarError extends Error {
  public readonly code: string | number
  public readonly type: BotstarErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BotstarErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BotstarError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BotstarError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BotstarError instance
   */
  static fromError(error: any): BotstarError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BotstarErrorType; retryable: boolean }> = {
      '401': { type: BotstarErrorType.Authentication, retryable: false },
      '429': { type: BotstarErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BotstarError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BotstarErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BotstarErrorType.Authentication
    } else if (statusCode === 403) {
      type = BotstarErrorType.Authorization
    } else if (statusCode === 404) {
      type = BotstarErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BotstarErrorType.Validation
    } else if (statusCode === 429) {
      type = BotstarErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BotstarErrorType.Server
      retryable = true
    }

    return new BotstarError(message, code, type, {
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
    return this.type === BotstarErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BotstarErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BotstarErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BotstarErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BotstarErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BotstarErrorType.Server
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

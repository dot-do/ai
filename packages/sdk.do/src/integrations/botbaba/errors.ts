/**
 * Botbaba Errors
 *
 * Auto-generated error handling for Botbaba Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/botbaba
 */

/**
 * Error type enum
 */
export enum BotbabaErrorType {
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
 * Botbaba Error class
 *
 * Custom error class for Botbaba Integration operations.
 */
export class BotbabaError extends Error {
  public readonly code: string | number
  public readonly type: BotbabaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BotbabaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BotbabaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BotbabaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BotbabaError instance
   */
  static fromError(error: any): BotbabaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BotbabaErrorType; retryable: boolean }> = {
      '401': { type: BotbabaErrorType.Authentication, retryable: false },
      '429': { type: BotbabaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BotbabaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BotbabaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BotbabaErrorType.Authentication
    } else if (statusCode === 403) {
      type = BotbabaErrorType.Authorization
    } else if (statusCode === 404) {
      type = BotbabaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BotbabaErrorType.Validation
    } else if (statusCode === 429) {
      type = BotbabaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BotbabaErrorType.Server
      retryable = true
    }

    return new BotbabaError(message, code, type, {
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
    return this.type === BotbabaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BotbabaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BotbabaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BotbabaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BotbabaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BotbabaErrorType.Server
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

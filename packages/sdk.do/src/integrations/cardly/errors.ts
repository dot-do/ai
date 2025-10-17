/**
 * Cardly Errors
 *
 * Auto-generated error handling for Cardly Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/cardly
 */

/**
 * Error type enum
 */
export enum CardlyErrorType {
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
 * Cardly Error class
 *
 * Custom error class for Cardly Integration operations.
 */
export class CardlyError extends Error {
  public readonly code: string | number
  public readonly type: CardlyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CardlyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CardlyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CardlyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CardlyError instance
   */
  static fromError(error: any): CardlyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CardlyErrorType; retryable: boolean }> = {
      '401': { type: CardlyErrorType.Authentication, retryable: false },
      '429': { type: CardlyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CardlyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CardlyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CardlyErrorType.Authentication
    } else if (statusCode === 403) {
      type = CardlyErrorType.Authorization
    } else if (statusCode === 404) {
      type = CardlyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CardlyErrorType.Validation
    } else if (statusCode === 429) {
      type = CardlyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CardlyErrorType.Server
      retryable = true
    }

    return new CardlyError(message, code, type, {
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
    return this.type === CardlyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CardlyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CardlyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CardlyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CardlyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CardlyErrorType.Server
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

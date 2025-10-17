/**
 * Amcards Errors
 *
 * Auto-generated error handling for Amcards Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/amcards
 */

/**
 * Error type enum
 */
export enum AmcardsErrorType {
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
 * Amcards Error class
 *
 * Custom error class for Amcards Integration operations.
 */
export class AmcardsError extends Error {
  public readonly code: string | number
  public readonly type: AmcardsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AmcardsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AmcardsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AmcardsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AmcardsError instance
   */
  static fromError(error: any): AmcardsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AmcardsErrorType; retryable: boolean }> = {
      '401': { type: AmcardsErrorType.Authentication, retryable: false },
      '429': { type: AmcardsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AmcardsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AmcardsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AmcardsErrorType.Authentication
    } else if (statusCode === 403) {
      type = AmcardsErrorType.Authorization
    } else if (statusCode === 404) {
      type = AmcardsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AmcardsErrorType.Validation
    } else if (statusCode === 429) {
      type = AmcardsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AmcardsErrorType.Server
      retryable = true
    }

    return new AmcardsError(message, code, type, {
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
    return this.type === AmcardsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AmcardsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AmcardsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AmcardsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AmcardsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AmcardsErrorType.Server
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

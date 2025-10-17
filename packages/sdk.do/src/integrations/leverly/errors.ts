/**
 * Leverly Errors
 *
 * Auto-generated error handling for Leverly Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/leverly
 */

/**
 * Error type enum
 */
export enum LeverlyErrorType {
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
 * Leverly Error class
 *
 * Custom error class for Leverly Integration operations.
 */
export class LeverlyError extends Error {
  public readonly code: string | number
  public readonly type: LeverlyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LeverlyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LeverlyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LeverlyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LeverlyError instance
   */
  static fromError(error: any): LeverlyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LeverlyErrorType; retryable: boolean }> = {
      '401': { type: LeverlyErrorType.Authentication, retryable: false },
      '429': { type: LeverlyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LeverlyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LeverlyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LeverlyErrorType.Authentication
    } else if (statusCode === 403) {
      type = LeverlyErrorType.Authorization
    } else if (statusCode === 404) {
      type = LeverlyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LeverlyErrorType.Validation
    } else if (statusCode === 429) {
      type = LeverlyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LeverlyErrorType.Server
      retryable = true
    }

    return new LeverlyError(message, code, type, {
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
    return this.type === LeverlyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LeverlyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LeverlyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LeverlyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LeverlyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LeverlyErrorType.Server
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

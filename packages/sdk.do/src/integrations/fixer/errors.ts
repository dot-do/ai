/**
 * Fixer Errors
 *
 * Auto-generated error handling for Fixer Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/fixer
 */

/**
 * Error type enum
 */
export enum FixerErrorType {
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
 * Fixer Error class
 *
 * Custom error class for Fixer Integration operations.
 */
export class FixerError extends Error {
  public readonly code: string | number
  public readonly type: FixerErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FixerErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FixerError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FixerError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FixerError instance
   */
  static fromError(error: any): FixerError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FixerErrorType; retryable: boolean }> = {
      '401': { type: FixerErrorType.Authentication, retryable: false },
      '429': { type: FixerErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FixerError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FixerErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FixerErrorType.Authentication
    } else if (statusCode === 403) {
      type = FixerErrorType.Authorization
    } else if (statusCode === 404) {
      type = FixerErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FixerErrorType.Validation
    } else if (statusCode === 429) {
      type = FixerErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FixerErrorType.Server
      retryable = true
    }

    return new FixerError(message, code, type, {
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
    return this.type === FixerErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FixerErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FixerErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FixerErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FixerErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FixerErrorType.Server
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

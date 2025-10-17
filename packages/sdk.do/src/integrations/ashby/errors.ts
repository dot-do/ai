/**
 * Ashby Errors
 *
 * Auto-generated error handling for Ashby Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ashby
 */

/**
 * Error type enum
 */
export enum AshbyErrorType {
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
 * Ashby Error class
 *
 * Custom error class for Ashby Integration operations.
 */
export class AshbyError extends Error {
  public readonly code: string | number
  public readonly type: AshbyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AshbyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AshbyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AshbyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AshbyError instance
   */
  static fromError(error: any): AshbyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AshbyErrorType; retryable: boolean }> = {
      '401': { type: AshbyErrorType.Authentication, retryable: false },
      '429': { type: AshbyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AshbyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AshbyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AshbyErrorType.Authentication
    } else if (statusCode === 403) {
      type = AshbyErrorType.Authorization
    } else if (statusCode === 404) {
      type = AshbyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AshbyErrorType.Validation
    } else if (statusCode === 429) {
      type = AshbyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AshbyErrorType.Server
      retryable = true
    }

    return new AshbyError(message, code, type, {
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
    return this.type === AshbyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AshbyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AshbyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AshbyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AshbyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AshbyErrorType.Server
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

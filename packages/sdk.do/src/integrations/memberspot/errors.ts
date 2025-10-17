/**
 * Memberspot Errors
 *
 * Auto-generated error handling for Memberspot Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/memberspot
 */

/**
 * Error type enum
 */
export enum MemberspotErrorType {
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
 * Memberspot Error class
 *
 * Custom error class for Memberspot Integration operations.
 */
export class MemberspotError extends Error {
  public readonly code: string | number
  public readonly type: MemberspotErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MemberspotErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MemberspotError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MemberspotError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MemberspotError instance
   */
  static fromError(error: any): MemberspotError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MemberspotErrorType; retryable: boolean }> = {
      '401': { type: MemberspotErrorType.Authentication, retryable: false },
      '429': { type: MemberspotErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MemberspotError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MemberspotErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MemberspotErrorType.Authentication
    } else if (statusCode === 403) {
      type = MemberspotErrorType.Authorization
    } else if (statusCode === 404) {
      type = MemberspotErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MemberspotErrorType.Validation
    } else if (statusCode === 429) {
      type = MemberspotErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MemberspotErrorType.Server
      retryable = true
    }

    return new MemberspotError(message, code, type, {
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
    return this.type === MemberspotErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MemberspotErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MemberspotErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MemberspotErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MemberspotErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MemberspotErrorType.Server
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

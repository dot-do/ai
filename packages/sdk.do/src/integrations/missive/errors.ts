/**
 * Missive Errors
 *
 * Auto-generated error handling for Missive Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/missive
 */

/**
 * Error type enum
 */
export enum MissiveErrorType {
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
 * Missive Error class
 *
 * Custom error class for Missive Integration operations.
 */
export class MissiveError extends Error {
  public readonly code: string | number
  public readonly type: MissiveErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MissiveErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MissiveError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MissiveError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MissiveError instance
   */
  static fromError(error: any): MissiveError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MissiveErrorType; retryable: boolean }> = {
      '401': { type: MissiveErrorType.Authentication, retryable: false },
      '429': { type: MissiveErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MissiveError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MissiveErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MissiveErrorType.Authentication
    } else if (statusCode === 403) {
      type = MissiveErrorType.Authorization
    } else if (statusCode === 404) {
      type = MissiveErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MissiveErrorType.Validation
    } else if (statusCode === 429) {
      type = MissiveErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MissiveErrorType.Server
      retryable = true
    }

    return new MissiveError(message, code, type, {
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
    return this.type === MissiveErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MissiveErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MissiveErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MissiveErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MissiveErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MissiveErrorType.Server
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

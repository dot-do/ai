/**
 * Abyssale Errors
 *
 * Auto-generated error handling for Abyssale Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/abyssale
 */

/**
 * Error type enum
 */
export enum AbyssaleErrorType {
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
 * Abyssale Error class
 *
 * Custom error class for Abyssale Integration operations.
 */
export class AbyssaleError extends Error {
  public readonly code: string | number
  public readonly type: AbyssaleErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AbyssaleErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AbyssaleError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AbyssaleError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AbyssaleError instance
   */
  static fromError(error: any): AbyssaleError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AbyssaleErrorType; retryable: boolean }> = {
      '401': { type: AbyssaleErrorType.Authentication, retryable: false },
      '429': { type: AbyssaleErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AbyssaleError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AbyssaleErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AbyssaleErrorType.Authentication
    } else if (statusCode === 403) {
      type = AbyssaleErrorType.Authorization
    } else if (statusCode === 404) {
      type = AbyssaleErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AbyssaleErrorType.Validation
    } else if (statusCode === 429) {
      type = AbyssaleErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AbyssaleErrorType.Server
      retryable = true
    }

    return new AbyssaleError(message, code, type, {
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
    return this.type === AbyssaleErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AbyssaleErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AbyssaleErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AbyssaleErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AbyssaleErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AbyssaleErrorType.Server
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

/**
 * Agencyzoom Errors
 *
 * Auto-generated error handling for Agencyzoom Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/agencyzoom
 */

/**
 * Error type enum
 */
export enum AgencyzoomErrorType {
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
 * Agencyzoom Error class
 *
 * Custom error class for Agencyzoom Integration operations.
 */
export class AgencyzoomError extends Error {
  public readonly code: string | number
  public readonly type: AgencyzoomErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AgencyzoomErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AgencyzoomError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AgencyzoomError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AgencyzoomError instance
   */
  static fromError(error: any): AgencyzoomError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AgencyzoomErrorType; retryable: boolean }> = {
      '401': { type: AgencyzoomErrorType.Authentication, retryable: false },
      '429': { type: AgencyzoomErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AgencyzoomError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AgencyzoomErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AgencyzoomErrorType.Authentication
    } else if (statusCode === 403) {
      type = AgencyzoomErrorType.Authorization
    } else if (statusCode === 404) {
      type = AgencyzoomErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AgencyzoomErrorType.Validation
    } else if (statusCode === 429) {
      type = AgencyzoomErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AgencyzoomErrorType.Server
      retryable = true
    }

    return new AgencyzoomError(message, code, type, {
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
    return this.type === AgencyzoomErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AgencyzoomErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AgencyzoomErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AgencyzoomErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AgencyzoomErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AgencyzoomErrorType.Server
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

/**
 * Identitycheck Errors
 *
 * Auto-generated error handling for Identitycheck Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/identitycheck
 */

/**
 * Error type enum
 */
export enum IdentitycheckErrorType {
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
 * Identitycheck Error class
 *
 * Custom error class for Identitycheck Integration operations.
 */
export class IdentitycheckError extends Error {
  public readonly code: string | number
  public readonly type: IdentitycheckErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: IdentitycheckErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'IdentitycheckError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IdentitycheckError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns IdentitycheckError instance
   */
  static fromError(error: any): IdentitycheckError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: IdentitycheckErrorType; retryable: boolean }> = {
      '401': { type: IdentitycheckErrorType.Authentication, retryable: false },
      '429': { type: IdentitycheckErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new IdentitycheckError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = IdentitycheckErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = IdentitycheckErrorType.Authentication
    } else if (statusCode === 403) {
      type = IdentitycheckErrorType.Authorization
    } else if (statusCode === 404) {
      type = IdentitycheckErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = IdentitycheckErrorType.Validation
    } else if (statusCode === 429) {
      type = IdentitycheckErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = IdentitycheckErrorType.Server
      retryable = true
    }

    return new IdentitycheckError(message, code, type, {
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
    return this.type === IdentitycheckErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === IdentitycheckErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === IdentitycheckErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === IdentitycheckErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === IdentitycheckErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === IdentitycheckErrorType.Server
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

/**
 * Magnetic Errors
 *
 * Auto-generated error handling for Magnetic Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/magnetic
 */

/**
 * Error type enum
 */
export enum MagneticErrorType {
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
 * Magnetic Error class
 *
 * Custom error class for Magnetic Integration operations.
 */
export class MagneticError extends Error {
  public readonly code: string | number
  public readonly type: MagneticErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MagneticErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MagneticError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MagneticError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MagneticError instance
   */
  static fromError(error: any): MagneticError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MagneticErrorType; retryable: boolean }> = {
      '401': { type: MagneticErrorType.Authentication, retryable: false },
      '429': { type: MagneticErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MagneticError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MagneticErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MagneticErrorType.Authentication
    } else if (statusCode === 403) {
      type = MagneticErrorType.Authorization
    } else if (statusCode === 404) {
      type = MagneticErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MagneticErrorType.Validation
    } else if (statusCode === 429) {
      type = MagneticErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MagneticErrorType.Server
      retryable = true
    }

    return new MagneticError(message, code, type, {
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
    return this.type === MagneticErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MagneticErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MagneticErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MagneticErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MagneticErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MagneticErrorType.Server
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

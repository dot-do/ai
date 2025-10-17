/**
 * Turso Errors
 *
 * Auto-generated error handling for Turso Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/turso
 */

/**
 * Error type enum
 */
export enum TursoErrorType {
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
 * Turso Error class
 *
 * Custom error class for Turso Integration operations.
 */
export class TursoError extends Error {
  public readonly code: string | number
  public readonly type: TursoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TursoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TursoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TursoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TursoError instance
   */
  static fromError(error: any): TursoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TursoErrorType; retryable: boolean }> = {
      '401': { type: TursoErrorType.Authentication, retryable: false },
      '429': { type: TursoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TursoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TursoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TursoErrorType.Authentication
    } else if (statusCode === 403) {
      type = TursoErrorType.Authorization
    } else if (statusCode === 404) {
      type = TursoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TursoErrorType.Validation
    } else if (statusCode === 429) {
      type = TursoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TursoErrorType.Server
      retryable = true
    }

    return new TursoError(message, code, type, {
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
    return this.type === TursoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TursoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TursoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TursoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TursoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TursoErrorType.Server
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

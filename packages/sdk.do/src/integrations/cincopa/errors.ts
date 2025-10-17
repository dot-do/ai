/**
 * Cincopa Errors
 *
 * Auto-generated error handling for Cincopa Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/cincopa
 */

/**
 * Error type enum
 */
export enum CincopaErrorType {
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
 * Cincopa Error class
 *
 * Custom error class for Cincopa Integration operations.
 */
export class CincopaError extends Error {
  public readonly code: string | number
  public readonly type: CincopaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CincopaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CincopaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CincopaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CincopaError instance
   */
  static fromError(error: any): CincopaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CincopaErrorType; retryable: boolean }> = {
      '401': { type: CincopaErrorType.Authentication, retryable: false },
      '429': { type: CincopaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CincopaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CincopaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CincopaErrorType.Authentication
    } else if (statusCode === 403) {
      type = CincopaErrorType.Authorization
    } else if (statusCode === 404) {
      type = CincopaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CincopaErrorType.Validation
    } else if (statusCode === 429) {
      type = CincopaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CincopaErrorType.Server
      retryable = true
    }

    return new CincopaError(message, code, type, {
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
    return this.type === CincopaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CincopaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CincopaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CincopaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CincopaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CincopaErrorType.Server
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

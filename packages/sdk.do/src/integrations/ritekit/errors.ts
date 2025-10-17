/**
 * Ritekit Errors
 *
 * Auto-generated error handling for Ritekit Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ritekit
 */

/**
 * Error type enum
 */
export enum RitekitErrorType {
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
 * Ritekit Error class
 *
 * Custom error class for Ritekit Integration operations.
 */
export class RitekitError extends Error {
  public readonly code: string | number
  public readonly type: RitekitErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RitekitErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RitekitError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RitekitError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RitekitError instance
   */
  static fromError(error: any): RitekitError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RitekitErrorType; retryable: boolean }> = {
      '401': { type: RitekitErrorType.Authentication, retryable: false },
      '429': { type: RitekitErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RitekitError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RitekitErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RitekitErrorType.Authentication
    } else if (statusCode === 403) {
      type = RitekitErrorType.Authorization
    } else if (statusCode === 404) {
      type = RitekitErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RitekitErrorType.Validation
    } else if (statusCode === 429) {
      type = RitekitErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RitekitErrorType.Server
      retryable = true
    }

    return new RitekitError(message, code, type, {
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
    return this.type === RitekitErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RitekitErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RitekitErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RitekitErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RitekitErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RitekitErrorType.Server
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

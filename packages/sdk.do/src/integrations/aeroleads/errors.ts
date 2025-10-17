/**
 * Aeroleads Errors
 *
 * Auto-generated error handling for Aeroleads Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/aeroleads
 */

/**
 * Error type enum
 */
export enum AeroleadsErrorType {
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
 * Aeroleads Error class
 *
 * Custom error class for Aeroleads Integration operations.
 */
export class AeroleadsError extends Error {
  public readonly code: string | number
  public readonly type: AeroleadsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AeroleadsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AeroleadsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AeroleadsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AeroleadsError instance
   */
  static fromError(error: any): AeroleadsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AeroleadsErrorType; retryable: boolean }> = {
      '401': { type: AeroleadsErrorType.Authentication, retryable: false },
      '429': { type: AeroleadsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AeroleadsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AeroleadsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AeroleadsErrorType.Authentication
    } else if (statusCode === 403) {
      type = AeroleadsErrorType.Authorization
    } else if (statusCode === 404) {
      type = AeroleadsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AeroleadsErrorType.Validation
    } else if (statusCode === 429) {
      type = AeroleadsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AeroleadsErrorType.Server
      retryable = true
    }

    return new AeroleadsError(message, code, type, {
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
    return this.type === AeroleadsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AeroleadsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AeroleadsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AeroleadsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AeroleadsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AeroleadsErrorType.Server
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

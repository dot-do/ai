/**
 * Boloforms Errors
 *
 * Auto-generated error handling for Boloforms Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/boloforms
 */

/**
 * Error type enum
 */
export enum BoloformsErrorType {
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
 * Boloforms Error class
 *
 * Custom error class for Boloforms Integration operations.
 */
export class BoloformsError extends Error {
  public readonly code: string | number
  public readonly type: BoloformsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BoloformsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BoloformsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BoloformsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BoloformsError instance
   */
  static fromError(error: any): BoloformsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BoloformsErrorType; retryable: boolean }> = {
      '401': { type: BoloformsErrorType.Authentication, retryable: false },
      '429': { type: BoloformsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BoloformsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BoloformsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BoloformsErrorType.Authentication
    } else if (statusCode === 403) {
      type = BoloformsErrorType.Authorization
    } else if (statusCode === 404) {
      type = BoloformsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BoloformsErrorType.Validation
    } else if (statusCode === 429) {
      type = BoloformsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BoloformsErrorType.Server
      retryable = true
    }

    return new BoloformsError(message, code, type, {
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
    return this.type === BoloformsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BoloformsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BoloformsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BoloformsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BoloformsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BoloformsErrorType.Server
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

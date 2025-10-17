/**
 * Ayrshare Errors
 *
 * Auto-generated error handling for Ayrshare Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ayrshare
 */

/**
 * Error type enum
 */
export enum AyrshareErrorType {
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
 * Ayrshare Error class
 *
 * Custom error class for Ayrshare Integration operations.
 */
export class AyrshareError extends Error {
  public readonly code: string | number
  public readonly type: AyrshareErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AyrshareErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AyrshareError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AyrshareError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AyrshareError instance
   */
  static fromError(error: any): AyrshareError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AyrshareErrorType; retryable: boolean }> = {
      '401': { type: AyrshareErrorType.Authentication, retryable: false },
      '429': { type: AyrshareErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AyrshareError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AyrshareErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AyrshareErrorType.Authentication
    } else if (statusCode === 403) {
      type = AyrshareErrorType.Authorization
    } else if (statusCode === 404) {
      type = AyrshareErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AyrshareErrorType.Validation
    } else if (statusCode === 429) {
      type = AyrshareErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AyrshareErrorType.Server
      retryable = true
    }

    return new AyrshareError(message, code, type, {
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
    return this.type === AyrshareErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AyrshareErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AyrshareErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AyrshareErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AyrshareErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AyrshareErrorType.Server
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

/**
 * Agiled Errors
 *
 * Auto-generated error handling for Agiled Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/agiled
 */

/**
 * Error type enum
 */
export enum AgiledErrorType {
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
 * Agiled Error class
 *
 * Custom error class for Agiled Integration operations.
 */
export class AgiledError extends Error {
  public readonly code: string | number
  public readonly type: AgiledErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AgiledErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AgiledError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AgiledError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AgiledError instance
   */
  static fromError(error: any): AgiledError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AgiledErrorType; retryable: boolean }> = {
      '401': { type: AgiledErrorType.Authentication, retryable: false },
      '429': { type: AgiledErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AgiledError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AgiledErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AgiledErrorType.Authentication
    } else if (statusCode === 403) {
      type = AgiledErrorType.Authorization
    } else if (statusCode === 404) {
      type = AgiledErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AgiledErrorType.Validation
    } else if (statusCode === 429) {
      type = AgiledErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AgiledErrorType.Server
      retryable = true
    }

    return new AgiledError(message, code, type, {
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
    return this.type === AgiledErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AgiledErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AgiledErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AgiledErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AgiledErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AgiledErrorType.Server
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

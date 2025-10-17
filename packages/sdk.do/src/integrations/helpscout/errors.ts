/**
 * Help Scout Errors
 *
 * Auto-generated error handling for Help Scout Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/helpscout
 */

/**
 * Error type enum
 */
export enum HelpscoutErrorType {
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
 * Help Scout Error class
 *
 * Custom error class for Help Scout Integration operations.
 */
export class HelpscoutError extends Error {
  public readonly code: string | number
  public readonly type: HelpscoutErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: HelpscoutErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'HelpscoutError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HelpscoutError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns HelpscoutError instance
   */
  static fromError(error: any): HelpscoutError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: HelpscoutErrorType; retryable: boolean }> = {
      invalid_token: { type: HelpscoutErrorType.Authentication, retryable: false },
      forbidden: { type: HelpscoutErrorType.Authorization, retryable: false },
      not_found: { type: HelpscoutErrorType.NotFound, retryable: false },
      validation_error: { type: HelpscoutErrorType.Validation, retryable: false },
      rate_limit: { type: HelpscoutErrorType.RateLimit, retryable: true },
      server_error: { type: HelpscoutErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new HelpscoutError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = HelpscoutErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = HelpscoutErrorType.Authentication
    } else if (statusCode === 403) {
      type = HelpscoutErrorType.Authorization
    } else if (statusCode === 404) {
      type = HelpscoutErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = HelpscoutErrorType.Validation
    } else if (statusCode === 429) {
      type = HelpscoutErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = HelpscoutErrorType.Server
      retryable = true
    }

    return new HelpscoutError(message, code, type, {
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
    return this.type === HelpscoutErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === HelpscoutErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === HelpscoutErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === HelpscoutErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === HelpscoutErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === HelpscoutErrorType.Server
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

/**
 * Make Errors
 *
 * Auto-generated error handling for Make Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/make
 */

/**
 * Error type enum
 */
export enum MakeErrorType {
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
 * Make Error class
 *
 * Custom error class for Make Integration operations.
 */
export class MakeError extends Error {
  public readonly code: string | number
  public readonly type: MakeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MakeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MakeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MakeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MakeError instance
   */
  static fromError(error: any): MakeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MakeErrorType; retryable: boolean }> = {
      '401': { type: MakeErrorType.Authentication, retryable: false },
      '429': { type: MakeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MakeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MakeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MakeErrorType.Authentication
    } else if (statusCode === 403) {
      type = MakeErrorType.Authorization
    } else if (statusCode === 404) {
      type = MakeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MakeErrorType.Validation
    } else if (statusCode === 429) {
      type = MakeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MakeErrorType.Server
      retryable = true
    }

    return new MakeError(message, code, type, {
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
    return this.type === MakeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MakeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MakeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MakeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MakeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MakeErrorType.Server
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

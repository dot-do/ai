/**
 * Monday Errors
 *
 * Auto-generated error handling for Monday Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/monday
 */

/**
 * Error type enum
 */
export enum MondayErrorType {
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
 * Monday Error class
 *
 * Custom error class for Monday Integration operations.
 */
export class MondayError extends Error {
  public readonly code: string | number
  public readonly type: MondayErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MondayErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MondayError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MondayError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MondayError instance
   */
  static fromError(error: any): MondayError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MondayErrorType; retryable: boolean }> = {
      '401': { type: MondayErrorType.Authentication, retryable: false },
      '429': { type: MondayErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MondayError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MondayErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MondayErrorType.Authentication
    } else if (statusCode === 403) {
      type = MondayErrorType.Authorization
    } else if (statusCode === 404) {
      type = MondayErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MondayErrorType.Validation
    } else if (statusCode === 429) {
      type = MondayErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MondayErrorType.Server
      retryable = true
    }

    return new MondayError(message, code, type, {
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
    return this.type === MondayErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MondayErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MondayErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MondayErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MondayErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MondayErrorType.Server
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

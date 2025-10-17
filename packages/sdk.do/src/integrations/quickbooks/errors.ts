/**
 * QuickBooks Errors
 *
 * Auto-generated error handling for QuickBooks Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/quickbooks
 */

/**
 * Error type enum
 */
export enum QuickbooksErrorType {
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
 * QuickBooks Error class
 *
 * Custom error class for QuickBooks Integration operations.
 */
export class QuickbooksError extends Error {
  public readonly code: string | number
  public readonly type: QuickbooksErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: QuickbooksErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'QuickbooksError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, QuickbooksError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns QuickbooksError instance
   */
  static fromError(error: any): QuickbooksError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: QuickbooksErrorType; retryable: boolean }> = {
      AuthenticationFailed: { type: QuickbooksErrorType.Authentication, retryable: false },
      AuthorizationFailed: { type: QuickbooksErrorType.Authorization, retryable: false },
      ValidationFault: { type: QuickbooksErrorType.Validation, retryable: false },
      ObjectNotFound: { type: QuickbooksErrorType.NotFound, retryable: false },
      ThrottleExceeded: { type: QuickbooksErrorType.RateLimit, retryable: true },
      InternalServerError: { type: QuickbooksErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new QuickbooksError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = QuickbooksErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = QuickbooksErrorType.Authentication
    } else if (statusCode === 403) {
      type = QuickbooksErrorType.Authorization
    } else if (statusCode === 404) {
      type = QuickbooksErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = QuickbooksErrorType.Validation
    } else if (statusCode === 429) {
      type = QuickbooksErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = QuickbooksErrorType.Server
      retryable = true
    }

    return new QuickbooksError(message, code, type, {
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
    return this.type === QuickbooksErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === QuickbooksErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === QuickbooksErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === QuickbooksErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === QuickbooksErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === QuickbooksErrorType.Server
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

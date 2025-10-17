/**
 * Baselinker Errors
 *
 * Auto-generated error handling for Baselinker Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/baselinker
 */

/**
 * Error type enum
 */
export enum BaselinkerErrorType {
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
 * Baselinker Error class
 *
 * Custom error class for Baselinker Integration operations.
 */
export class BaselinkerError extends Error {
  public readonly code: string | number
  public readonly type: BaselinkerErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BaselinkerErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BaselinkerError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaselinkerError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BaselinkerError instance
   */
  static fromError(error: any): BaselinkerError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BaselinkerErrorType; retryable: boolean }> = {
      '401': { type: BaselinkerErrorType.Authentication, retryable: false },
      '429': { type: BaselinkerErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BaselinkerError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BaselinkerErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BaselinkerErrorType.Authentication
    } else if (statusCode === 403) {
      type = BaselinkerErrorType.Authorization
    } else if (statusCode === 404) {
      type = BaselinkerErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BaselinkerErrorType.Validation
    } else if (statusCode === 429) {
      type = BaselinkerErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BaselinkerErrorType.Server
      retryable = true
    }

    return new BaselinkerError(message, code, type, {
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
    return this.type === BaselinkerErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BaselinkerErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BaselinkerErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BaselinkerErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BaselinkerErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BaselinkerErrorType.Server
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

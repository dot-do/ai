/**
 * Baserow Errors
 *
 * Auto-generated error handling for Baserow Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/baserow
 */

/**
 * Error type enum
 */
export enum BaserowErrorType {
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
 * Baserow Error class
 *
 * Custom error class for Baserow Integration operations.
 */
export class BaserowError extends Error {
  public readonly code: string | number
  public readonly type: BaserowErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BaserowErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BaserowError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaserowError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BaserowError instance
   */
  static fromError(error: any): BaserowError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BaserowErrorType; retryable: boolean }> = {
      '401': { type: BaserowErrorType.Authentication, retryable: false },
      '429': { type: BaserowErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BaserowError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BaserowErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BaserowErrorType.Authentication
    } else if (statusCode === 403) {
      type = BaserowErrorType.Authorization
    } else if (statusCode === 404) {
      type = BaserowErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BaserowErrorType.Validation
    } else if (statusCode === 429) {
      type = BaserowErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BaserowErrorType.Server
      retryable = true
    }

    return new BaserowError(message, code, type, {
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
    return this.type === BaserowErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BaserowErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BaserowErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BaserowErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BaserowErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BaserowErrorType.Server
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

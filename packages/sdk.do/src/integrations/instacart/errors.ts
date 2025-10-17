/**
 * Instacart Errors
 *
 * Auto-generated error handling for Instacart Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/instacart
 */

/**
 * Error type enum
 */
export enum InstacartErrorType {
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
 * Instacart Error class
 *
 * Custom error class for Instacart Integration operations.
 */
export class InstacartError extends Error {
  public readonly code: string | number
  public readonly type: InstacartErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: InstacartErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'InstacartError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InstacartError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns InstacartError instance
   */
  static fromError(error: any): InstacartError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: InstacartErrorType; retryable: boolean }> = {
      '401': { type: InstacartErrorType.Authentication, retryable: false },
      '429': { type: InstacartErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new InstacartError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = InstacartErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = InstacartErrorType.Authentication
    } else if (statusCode === 403) {
      type = InstacartErrorType.Authorization
    } else if (statusCode === 404) {
      type = InstacartErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = InstacartErrorType.Validation
    } else if (statusCode === 429) {
      type = InstacartErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = InstacartErrorType.Server
      retryable = true
    }

    return new InstacartError(message, code, type, {
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
    return this.type === InstacartErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === InstacartErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === InstacartErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === InstacartErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === InstacartErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === InstacartErrorType.Server
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

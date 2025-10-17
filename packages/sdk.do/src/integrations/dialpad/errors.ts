/**
 * Dialpad Errors
 *
 * Auto-generated error handling for Dialpad Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/dialpad
 */

/**
 * Error type enum
 */
export enum DialpadErrorType {
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
 * Dialpad Error class
 *
 * Custom error class for Dialpad Integration operations.
 */
export class DialpadError extends Error {
  public readonly code: string | number
  public readonly type: DialpadErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DialpadErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DialpadError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DialpadError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DialpadError instance
   */
  static fromError(error: any): DialpadError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DialpadErrorType; retryable: boolean }> = {
      '401': { type: DialpadErrorType.Authentication, retryable: false },
      '429': { type: DialpadErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DialpadError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DialpadErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DialpadErrorType.Authentication
    } else if (statusCode === 403) {
      type = DialpadErrorType.Authorization
    } else if (statusCode === 404) {
      type = DialpadErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DialpadErrorType.Validation
    } else if (statusCode === 429) {
      type = DialpadErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DialpadErrorType.Server
      retryable = true
    }

    return new DialpadError(message, code, type, {
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
    return this.type === DialpadErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DialpadErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DialpadErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DialpadErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DialpadErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DialpadErrorType.Server
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

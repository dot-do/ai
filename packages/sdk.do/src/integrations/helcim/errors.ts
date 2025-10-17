/**
 * Helcim Errors
 *
 * Auto-generated error handling for Helcim Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/helcim
 */

/**
 * Error type enum
 */
export enum HelcimErrorType {
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
 * Helcim Error class
 *
 * Custom error class for Helcim Integration operations.
 */
export class HelcimError extends Error {
  public readonly code: string | number
  public readonly type: HelcimErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: HelcimErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'HelcimError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HelcimError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns HelcimError instance
   */
  static fromError(error: any): HelcimError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: HelcimErrorType; retryable: boolean }> = {
      '401': { type: HelcimErrorType.Authentication, retryable: false },
      '429': { type: HelcimErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new HelcimError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = HelcimErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = HelcimErrorType.Authentication
    } else if (statusCode === 403) {
      type = HelcimErrorType.Authorization
    } else if (statusCode === 404) {
      type = HelcimErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = HelcimErrorType.Validation
    } else if (statusCode === 429) {
      type = HelcimErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = HelcimErrorType.Server
      retryable = true
    }

    return new HelcimError(message, code, type, {
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
    return this.type === HelcimErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === HelcimErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === HelcimErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === HelcimErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === HelcimErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === HelcimErrorType.Server
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

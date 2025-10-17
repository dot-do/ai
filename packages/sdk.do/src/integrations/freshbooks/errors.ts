/**
 * Freshbooks Errors
 *
 * Auto-generated error handling for Freshbooks Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/freshbooks
 */

/**
 * Error type enum
 */
export enum FreshbooksErrorType {
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
 * Freshbooks Error class
 *
 * Custom error class for Freshbooks Integration operations.
 */
export class FreshbooksError extends Error {
  public readonly code: string | number
  public readonly type: FreshbooksErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FreshbooksErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FreshbooksError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FreshbooksError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FreshbooksError instance
   */
  static fromError(error: any): FreshbooksError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FreshbooksErrorType; retryable: boolean }> = {
      '401': { type: FreshbooksErrorType.Authentication, retryable: false },
      '429': { type: FreshbooksErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FreshbooksError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FreshbooksErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FreshbooksErrorType.Authentication
    } else if (statusCode === 403) {
      type = FreshbooksErrorType.Authorization
    } else if (statusCode === 404) {
      type = FreshbooksErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FreshbooksErrorType.Validation
    } else if (statusCode === 429) {
      type = FreshbooksErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FreshbooksErrorType.Server
      retryable = true
    }

    return new FreshbooksError(message, code, type, {
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
    return this.type === FreshbooksErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FreshbooksErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FreshbooksErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FreshbooksErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FreshbooksErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FreshbooksErrorType.Server
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

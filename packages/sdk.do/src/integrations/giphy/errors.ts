/**
 * Giphy Errors
 *
 * Auto-generated error handling for Giphy Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/giphy
 */

/**
 * Error type enum
 */
export enum GiphyErrorType {
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
 * Giphy Error class
 *
 * Custom error class for Giphy Integration operations.
 */
export class GiphyError extends Error {
  public readonly code: string | number
  public readonly type: GiphyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GiphyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GiphyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GiphyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GiphyError instance
   */
  static fromError(error: any): GiphyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GiphyErrorType; retryable: boolean }> = {
      '401': { type: GiphyErrorType.Authentication, retryable: false },
      '429': { type: GiphyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GiphyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GiphyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GiphyErrorType.Authentication
    } else if (statusCode === 403) {
      type = GiphyErrorType.Authorization
    } else if (statusCode === 404) {
      type = GiphyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GiphyErrorType.Validation
    } else if (statusCode === 429) {
      type = GiphyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GiphyErrorType.Server
      retryable = true
    }

    return new GiphyError(message, code, type, {
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
    return this.type === GiphyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GiphyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GiphyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GiphyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GiphyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GiphyErrorType.Server
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

/**
 * Amazon Errors
 *
 * Auto-generated error handling for Amazon Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/amazon
 */

/**
 * Error type enum
 */
export enum AmazonErrorType {
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
 * Amazon Error class
 *
 * Custom error class for Amazon Integration operations.
 */
export class AmazonError extends Error {
  public readonly code: string | number
  public readonly type: AmazonErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AmazonErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AmazonError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AmazonError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AmazonError instance
   */
  static fromError(error: any): AmazonError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AmazonErrorType; retryable: boolean }> = {
      '401': { type: AmazonErrorType.Authentication, retryable: false },
      '429': { type: AmazonErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AmazonError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AmazonErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AmazonErrorType.Authentication
    } else if (statusCode === 403) {
      type = AmazonErrorType.Authorization
    } else if (statusCode === 404) {
      type = AmazonErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AmazonErrorType.Validation
    } else if (statusCode === 429) {
      type = AmazonErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AmazonErrorType.Server
      retryable = true
    }

    return new AmazonError(message, code, type, {
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
    return this.type === AmazonErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AmazonErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AmazonErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AmazonErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AmazonErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AmazonErrorType.Server
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

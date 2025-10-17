/**
 * Segmetrics Errors
 *
 * Auto-generated error handling for Segmetrics Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/segmetrics
 */

/**
 * Error type enum
 */
export enum SegmetricsErrorType {
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
 * Segmetrics Error class
 *
 * Custom error class for Segmetrics Integration operations.
 */
export class SegmetricsError extends Error {
  public readonly code: string | number
  public readonly type: SegmetricsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SegmetricsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SegmetricsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SegmetricsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SegmetricsError instance
   */
  static fromError(error: any): SegmetricsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SegmetricsErrorType; retryable: boolean }> = {
      '401': { type: SegmetricsErrorType.Authentication, retryable: false },
      '429': { type: SegmetricsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SegmetricsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SegmetricsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SegmetricsErrorType.Authentication
    } else if (statusCode === 403) {
      type = SegmetricsErrorType.Authorization
    } else if (statusCode === 404) {
      type = SegmetricsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SegmetricsErrorType.Validation
    } else if (statusCode === 429) {
      type = SegmetricsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SegmetricsErrorType.Server
      retryable = true
    }

    return new SegmetricsError(message, code, type, {
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
    return this.type === SegmetricsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SegmetricsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SegmetricsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SegmetricsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SegmetricsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SegmetricsErrorType.Server
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

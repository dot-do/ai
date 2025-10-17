/**
 * Segment Errors
 *
 * Auto-generated error handling for Segment Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/segment
 */

/**
 * Error type enum
 */
export enum SegmentErrorType {
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
 * Segment Error class
 *
 * Custom error class for Segment Integration operations.
 */
export class SegmentError extends Error {
  public readonly code: string | number
  public readonly type: SegmentErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SegmentErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SegmentError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SegmentError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SegmentError instance
   */
  static fromError(error: any): SegmentError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SegmentErrorType; retryable: boolean }> = {
      invalid_write_key: { type: SegmentErrorType.Authentication, retryable: false },
      forbidden: { type: SegmentErrorType.Authorization, retryable: false },
      no_user_anon_id: { type: SegmentErrorType.Validation, retryable: false },
      missing_event: { type: SegmentErrorType.Validation, retryable: false },
      rate_limit: { type: SegmentErrorType.RateLimit, retryable: true },
      server_error: { type: SegmentErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SegmentError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SegmentErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SegmentErrorType.Authentication
    } else if (statusCode === 403) {
      type = SegmentErrorType.Authorization
    } else if (statusCode === 404) {
      type = SegmentErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SegmentErrorType.Validation
    } else if (statusCode === 429) {
      type = SegmentErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SegmentErrorType.Server
      retryable = true
    }

    return new SegmentError(message, code, type, {
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
    return this.type === SegmentErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SegmentErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SegmentErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SegmentErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SegmentErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SegmentErrorType.Server
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

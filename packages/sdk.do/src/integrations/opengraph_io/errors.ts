/**
 * Opengraph io Errors
 *
 * Auto-generated error handling for Opengraph io Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/opengraph_io
 */

/**
 * Error type enum
 */
export enum OpengraphIoErrorType {
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
 * Opengraph io Error class
 *
 * Custom error class for Opengraph io Integration operations.
 */
export class OpengraphIoError extends Error {
  public readonly code: string | number
  public readonly type: OpengraphIoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: OpengraphIoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'OpengraphIoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OpengraphIoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns OpengraphIoError instance
   */
  static fromError(error: any): OpengraphIoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: OpengraphIoErrorType; retryable: boolean }> = {
      '401': { type: OpengraphIoErrorType.Authentication, retryable: false },
      '429': { type: OpengraphIoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new OpengraphIoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = OpengraphIoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = OpengraphIoErrorType.Authentication
    } else if (statusCode === 403) {
      type = OpengraphIoErrorType.Authorization
    } else if (statusCode === 404) {
      type = OpengraphIoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = OpengraphIoErrorType.Validation
    } else if (statusCode === 429) {
      type = OpengraphIoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = OpengraphIoErrorType.Server
      retryable = true
    }

    return new OpengraphIoError(message, code, type, {
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
    return this.type === OpengraphIoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === OpengraphIoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === OpengraphIoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === OpengraphIoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === OpengraphIoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === OpengraphIoErrorType.Server
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

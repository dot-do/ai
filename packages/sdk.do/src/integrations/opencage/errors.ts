/**
 * Opencage Errors
 *
 * Auto-generated error handling for Opencage Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/opencage
 */

/**
 * Error type enum
 */
export enum OpencageErrorType {
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
 * Opencage Error class
 *
 * Custom error class for Opencage Integration operations.
 */
export class OpencageError extends Error {
  public readonly code: string | number
  public readonly type: OpencageErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: OpencageErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'OpencageError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OpencageError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns OpencageError instance
   */
  static fromError(error: any): OpencageError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: OpencageErrorType; retryable: boolean }> = {
      '401': { type: OpencageErrorType.Authentication, retryable: false },
      '429': { type: OpencageErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new OpencageError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = OpencageErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = OpencageErrorType.Authentication
    } else if (statusCode === 403) {
      type = OpencageErrorType.Authorization
    } else if (statusCode === 404) {
      type = OpencageErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = OpencageErrorType.Validation
    } else if (statusCode === 429) {
      type = OpencageErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = OpencageErrorType.Server
      retryable = true
    }

    return new OpencageError(message, code, type, {
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
    return this.type === OpencageErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === OpencageErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === OpencageErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === OpencageErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === OpencageErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === OpencageErrorType.Server
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

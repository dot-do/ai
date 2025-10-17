/**
 * Jobnimbus Errors
 *
 * Auto-generated error handling for Jobnimbus Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/jobnimbus
 */

/**
 * Error type enum
 */
export enum JobnimbusErrorType {
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
 * Jobnimbus Error class
 *
 * Custom error class for Jobnimbus Integration operations.
 */
export class JobnimbusError extends Error {
  public readonly code: string | number
  public readonly type: JobnimbusErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: JobnimbusErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'JobnimbusError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, JobnimbusError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns JobnimbusError instance
   */
  static fromError(error: any): JobnimbusError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: JobnimbusErrorType; retryable: boolean }> = {
      '401': { type: JobnimbusErrorType.Authentication, retryable: false },
      '429': { type: JobnimbusErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new JobnimbusError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = JobnimbusErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = JobnimbusErrorType.Authentication
    } else if (statusCode === 403) {
      type = JobnimbusErrorType.Authorization
    } else if (statusCode === 404) {
      type = JobnimbusErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = JobnimbusErrorType.Validation
    } else if (statusCode === 429) {
      type = JobnimbusErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = JobnimbusErrorType.Server
      retryable = true
    }

    return new JobnimbusError(message, code, type, {
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
    return this.type === JobnimbusErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === JobnimbusErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === JobnimbusErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === JobnimbusErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === JobnimbusErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === JobnimbusErrorType.Server
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

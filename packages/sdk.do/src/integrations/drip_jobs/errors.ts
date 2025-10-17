/**
 * Drip jobs Errors
 *
 * Auto-generated error handling for Drip jobs Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/drip_jobs
 */

/**
 * Error type enum
 */
export enum DripJobsErrorType {
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
 * Drip jobs Error class
 *
 * Custom error class for Drip jobs Integration operations.
 */
export class DripJobsError extends Error {
  public readonly code: string | number
  public readonly type: DripJobsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DripJobsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DripJobsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DripJobsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DripJobsError instance
   */
  static fromError(error: any): DripJobsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DripJobsErrorType; retryable: boolean }> = {
      '401': { type: DripJobsErrorType.Authentication, retryable: false },
      '429': { type: DripJobsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DripJobsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DripJobsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DripJobsErrorType.Authentication
    } else if (statusCode === 403) {
      type = DripJobsErrorType.Authorization
    } else if (statusCode === 404) {
      type = DripJobsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DripJobsErrorType.Validation
    } else if (statusCode === 429) {
      type = DripJobsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DripJobsErrorType.Server
      retryable = true
    }

    return new DripJobsError(message, code, type, {
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
    return this.type === DripJobsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DripJobsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DripJobsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DripJobsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DripJobsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DripJobsErrorType.Server
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

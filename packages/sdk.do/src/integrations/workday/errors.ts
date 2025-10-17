/**
 * Workday Errors
 *
 * Auto-generated error handling for Workday Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/workday
 */

/**
 * Error type enum
 */
export enum WorkdayErrorType {
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
 * Workday Error class
 *
 * Custom error class for Workday Integration operations.
 */
export class WorkdayError extends Error {
  public readonly code: string | number
  public readonly type: WorkdayErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WorkdayErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WorkdayError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WorkdayError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WorkdayError instance
   */
  static fromError(error: any): WorkdayError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WorkdayErrorType; retryable: boolean }> = {
      '401': { type: WorkdayErrorType.Authentication, retryable: false },
      '429': { type: WorkdayErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WorkdayError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WorkdayErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WorkdayErrorType.Authentication
    } else if (statusCode === 403) {
      type = WorkdayErrorType.Authorization
    } else if (statusCode === 404) {
      type = WorkdayErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WorkdayErrorType.Validation
    } else if (statusCode === 429) {
      type = WorkdayErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WorkdayErrorType.Server
      retryable = true
    }

    return new WorkdayError(message, code, type, {
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
    return this.type === WorkdayErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WorkdayErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WorkdayErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WorkdayErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WorkdayErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WorkdayErrorType.Server
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

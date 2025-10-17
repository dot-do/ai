/**
 * Workable Errors
 *
 * Auto-generated error handling for Workable Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/workable
 */

/**
 * Error type enum
 */
export enum WorkableErrorType {
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
 * Workable Error class
 *
 * Custom error class for Workable Integration operations.
 */
export class WorkableError extends Error {
  public readonly code: string | number
  public readonly type: WorkableErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WorkableErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WorkableError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WorkableError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WorkableError instance
   */
  static fromError(error: any): WorkableError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WorkableErrorType; retryable: boolean }> = {
      '401': { type: WorkableErrorType.Authentication, retryable: false },
      '429': { type: WorkableErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WorkableError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WorkableErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WorkableErrorType.Authentication
    } else if (statusCode === 403) {
      type = WorkableErrorType.Authorization
    } else if (statusCode === 404) {
      type = WorkableErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WorkableErrorType.Validation
    } else if (statusCode === 429) {
      type = WorkableErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WorkableErrorType.Server
      retryable = true
    }

    return new WorkableError(message, code, type, {
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
    return this.type === WorkableErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WorkableErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WorkableErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WorkableErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WorkableErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WorkableErrorType.Server
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

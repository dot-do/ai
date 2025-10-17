/**
 * Workiom Errors
 *
 * Auto-generated error handling for Workiom Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/workiom
 */

/**
 * Error type enum
 */
export enum WorkiomErrorType {
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
 * Workiom Error class
 *
 * Custom error class for Workiom Integration operations.
 */
export class WorkiomError extends Error {
  public readonly code: string | number
  public readonly type: WorkiomErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WorkiomErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WorkiomError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WorkiomError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WorkiomError instance
   */
  static fromError(error: any): WorkiomError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WorkiomErrorType; retryable: boolean }> = {
      '401': { type: WorkiomErrorType.Authentication, retryable: false },
      '429': { type: WorkiomErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WorkiomError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WorkiomErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WorkiomErrorType.Authentication
    } else if (statusCode === 403) {
      type = WorkiomErrorType.Authorization
    } else if (statusCode === 404) {
      type = WorkiomErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WorkiomErrorType.Validation
    } else if (statusCode === 429) {
      type = WorkiomErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WorkiomErrorType.Server
      retryable = true
    }

    return new WorkiomError(message, code, type, {
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
    return this.type === WorkiomErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WorkiomErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WorkiomErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WorkiomErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WorkiomErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WorkiomErrorType.Server
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

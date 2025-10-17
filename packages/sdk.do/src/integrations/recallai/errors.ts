/**
 * Recallai Errors
 *
 * Auto-generated error handling for Recallai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/recallai
 */

/**
 * Error type enum
 */
export enum RecallaiErrorType {
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
 * Recallai Error class
 *
 * Custom error class for Recallai Integration operations.
 */
export class RecallaiError extends Error {
  public readonly code: string | number
  public readonly type: RecallaiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RecallaiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RecallaiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RecallaiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RecallaiError instance
   */
  static fromError(error: any): RecallaiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RecallaiErrorType; retryable: boolean }> = {
      '401': { type: RecallaiErrorType.Authentication, retryable: false },
      '429': { type: RecallaiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RecallaiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RecallaiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RecallaiErrorType.Authentication
    } else if (statusCode === 403) {
      type = RecallaiErrorType.Authorization
    } else if (statusCode === 404) {
      type = RecallaiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RecallaiErrorType.Validation
    } else if (statusCode === 429) {
      type = RecallaiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RecallaiErrorType.Server
      retryable = true
    }

    return new RecallaiError(message, code, type, {
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
    return this.type === RecallaiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RecallaiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RecallaiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RecallaiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RecallaiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RecallaiErrorType.Server
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

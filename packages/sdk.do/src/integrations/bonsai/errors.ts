/**
 * Bonsai Errors
 *
 * Auto-generated error handling for Bonsai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bonsai
 */

/**
 * Error type enum
 */
export enum BonsaiErrorType {
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
 * Bonsai Error class
 *
 * Custom error class for Bonsai Integration operations.
 */
export class BonsaiError extends Error {
  public readonly code: string | number
  public readonly type: BonsaiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BonsaiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BonsaiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BonsaiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BonsaiError instance
   */
  static fromError(error: any): BonsaiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BonsaiErrorType; retryable: boolean }> = {
      '401': { type: BonsaiErrorType.Authentication, retryable: false },
      '429': { type: BonsaiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BonsaiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BonsaiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BonsaiErrorType.Authentication
    } else if (statusCode === 403) {
      type = BonsaiErrorType.Authorization
    } else if (statusCode === 404) {
      type = BonsaiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BonsaiErrorType.Validation
    } else if (statusCode === 429) {
      type = BonsaiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BonsaiErrorType.Server
      retryable = true
    }

    return new BonsaiError(message, code, type, {
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
    return this.type === BonsaiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BonsaiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BonsaiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BonsaiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BonsaiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BonsaiErrorType.Server
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

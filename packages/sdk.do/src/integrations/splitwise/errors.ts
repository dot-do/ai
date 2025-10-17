/**
 * Splitwise Errors
 *
 * Auto-generated error handling for Splitwise Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/splitwise
 */

/**
 * Error type enum
 */
export enum SplitwiseErrorType {
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
 * Splitwise Error class
 *
 * Custom error class for Splitwise Integration operations.
 */
export class SplitwiseError extends Error {
  public readonly code: string | number
  public readonly type: SplitwiseErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SplitwiseErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SplitwiseError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SplitwiseError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SplitwiseError instance
   */
  static fromError(error: any): SplitwiseError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SplitwiseErrorType; retryable: boolean }> = {
      '401': { type: SplitwiseErrorType.Authentication, retryable: false },
      '429': { type: SplitwiseErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SplitwiseError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SplitwiseErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SplitwiseErrorType.Authentication
    } else if (statusCode === 403) {
      type = SplitwiseErrorType.Authorization
    } else if (statusCode === 404) {
      type = SplitwiseErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SplitwiseErrorType.Validation
    } else if (statusCode === 429) {
      type = SplitwiseErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SplitwiseErrorType.Server
      retryable = true
    }

    return new SplitwiseError(message, code, type, {
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
    return this.type === SplitwiseErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SplitwiseErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SplitwiseErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SplitwiseErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SplitwiseErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SplitwiseErrorType.Server
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

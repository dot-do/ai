/**
 * Humanloop Errors
 *
 * Auto-generated error handling for Humanloop Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/humanloop
 */

/**
 * Error type enum
 */
export enum HumanloopErrorType {
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
 * Humanloop Error class
 *
 * Custom error class for Humanloop Integration operations.
 */
export class HumanloopError extends Error {
  public readonly code: string | number
  public readonly type: HumanloopErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: HumanloopErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'HumanloopError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HumanloopError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns HumanloopError instance
   */
  static fromError(error: any): HumanloopError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: HumanloopErrorType; retryable: boolean }> = {
      '401': { type: HumanloopErrorType.Authentication, retryable: false },
      '429': { type: HumanloopErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new HumanloopError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = HumanloopErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = HumanloopErrorType.Authentication
    } else if (statusCode === 403) {
      type = HumanloopErrorType.Authorization
    } else if (statusCode === 404) {
      type = HumanloopErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = HumanloopErrorType.Validation
    } else if (statusCode === 429) {
      type = HumanloopErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = HumanloopErrorType.Server
      retryable = true
    }

    return new HumanloopError(message, code, type, {
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
    return this.type === HumanloopErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === HumanloopErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === HumanloopErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === HumanloopErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === HumanloopErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === HumanloopErrorType.Server
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

/**
 * Deel Errors
 *
 * Auto-generated error handling for Deel Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/deel
 */

/**
 * Error type enum
 */
export enum DeelErrorType {
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
 * Deel Error class
 *
 * Custom error class for Deel Integration operations.
 */
export class DeelError extends Error {
  public readonly code: string | number
  public readonly type: DeelErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DeelErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DeelError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DeelError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DeelError instance
   */
  static fromError(error: any): DeelError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DeelErrorType; retryable: boolean }> = {
      '401': { type: DeelErrorType.Authentication, retryable: false },
      '429': { type: DeelErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DeelError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DeelErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DeelErrorType.Authentication
    } else if (statusCode === 403) {
      type = DeelErrorType.Authorization
    } else if (statusCode === 404) {
      type = DeelErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DeelErrorType.Validation
    } else if (statusCode === 429) {
      type = DeelErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DeelErrorType.Server
      retryable = true
    }

    return new DeelError(message, code, type, {
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
    return this.type === DeelErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DeelErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DeelErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DeelErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DeelErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DeelErrorType.Server
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

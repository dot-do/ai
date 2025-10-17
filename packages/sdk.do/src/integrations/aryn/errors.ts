/**
 * Aryn Errors
 *
 * Auto-generated error handling for Aryn Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/aryn
 */

/**
 * Error type enum
 */
export enum ArynErrorType {
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
 * Aryn Error class
 *
 * Custom error class for Aryn Integration operations.
 */
export class ArynError extends Error {
  public readonly code: string | number
  public readonly type: ArynErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ArynErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ArynError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ArynError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ArynError instance
   */
  static fromError(error: any): ArynError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ArynErrorType; retryable: boolean }> = {
      '401': { type: ArynErrorType.Authentication, retryable: false },
      '429': { type: ArynErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ArynError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ArynErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ArynErrorType.Authentication
    } else if (statusCode === 403) {
      type = ArynErrorType.Authorization
    } else if (statusCode === 404) {
      type = ArynErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ArynErrorType.Validation
    } else if (statusCode === 429) {
      type = ArynErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ArynErrorType.Server
      retryable = true
    }

    return new ArynError(message, code, type, {
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
    return this.type === ArynErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ArynErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ArynErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ArynErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ArynErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ArynErrorType.Server
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

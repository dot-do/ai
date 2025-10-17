/**
 * Anonyflow Errors
 *
 * Auto-generated error handling for Anonyflow Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/anonyflow
 */

/**
 * Error type enum
 */
export enum AnonyflowErrorType {
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
 * Anonyflow Error class
 *
 * Custom error class for Anonyflow Integration operations.
 */
export class AnonyflowError extends Error {
  public readonly code: string | number
  public readonly type: AnonyflowErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AnonyflowErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AnonyflowError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AnonyflowError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AnonyflowError instance
   */
  static fromError(error: any): AnonyflowError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AnonyflowErrorType; retryable: boolean }> = {
      '401': { type: AnonyflowErrorType.Authentication, retryable: false },
      '429': { type: AnonyflowErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AnonyflowError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AnonyflowErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AnonyflowErrorType.Authentication
    } else if (statusCode === 403) {
      type = AnonyflowErrorType.Authorization
    } else if (statusCode === 404) {
      type = AnonyflowErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AnonyflowErrorType.Validation
    } else if (statusCode === 429) {
      type = AnonyflowErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AnonyflowErrorType.Server
      retryable = true
    }

    return new AnonyflowError(message, code, type, {
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
    return this.type === AnonyflowErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AnonyflowErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AnonyflowErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AnonyflowErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AnonyflowErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AnonyflowErrorType.Server
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

/**
 * Signwell Errors
 *
 * Auto-generated error handling for Signwell Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/signwell
 */

/**
 * Error type enum
 */
export enum SignwellErrorType {
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
 * Signwell Error class
 *
 * Custom error class for Signwell Integration operations.
 */
export class SignwellError extends Error {
  public readonly code: string | number
  public readonly type: SignwellErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SignwellErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SignwellError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SignwellError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SignwellError instance
   */
  static fromError(error: any): SignwellError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SignwellErrorType; retryable: boolean }> = {
      '401': { type: SignwellErrorType.Authentication, retryable: false },
      '429': { type: SignwellErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SignwellError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SignwellErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SignwellErrorType.Authentication
    } else if (statusCode === 403) {
      type = SignwellErrorType.Authorization
    } else if (statusCode === 404) {
      type = SignwellErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SignwellErrorType.Validation
    } else if (statusCode === 429) {
      type = SignwellErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SignwellErrorType.Server
      retryable = true
    }

    return new SignwellError(message, code, type, {
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
    return this.type === SignwellErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SignwellErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SignwellErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SignwellErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SignwellErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SignwellErrorType.Server
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

/**
 * Veriphone Errors
 *
 * Auto-generated error handling for Veriphone Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/veriphone
 */

/**
 * Error type enum
 */
export enum VeriphoneErrorType {
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
 * Veriphone Error class
 *
 * Custom error class for Veriphone Integration operations.
 */
export class VeriphoneError extends Error {
  public readonly code: string | number
  public readonly type: VeriphoneErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: VeriphoneErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'VeriphoneError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VeriphoneError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns VeriphoneError instance
   */
  static fromError(error: any): VeriphoneError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: VeriphoneErrorType; retryable: boolean }> = {
      '401': { type: VeriphoneErrorType.Authentication, retryable: false },
      '429': { type: VeriphoneErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new VeriphoneError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = VeriphoneErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = VeriphoneErrorType.Authentication
    } else if (statusCode === 403) {
      type = VeriphoneErrorType.Authorization
    } else if (statusCode === 404) {
      type = VeriphoneErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = VeriphoneErrorType.Validation
    } else if (statusCode === 429) {
      type = VeriphoneErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = VeriphoneErrorType.Server
      retryable = true
    }

    return new VeriphoneError(message, code, type, {
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
    return this.type === VeriphoneErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === VeriphoneErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === VeriphoneErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === VeriphoneErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === VeriphoneErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === VeriphoneErrorType.Server
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

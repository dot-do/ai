/**
 * Carbone Errors
 *
 * Auto-generated error handling for Carbone Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/carbone
 */

/**
 * Error type enum
 */
export enum CarboneErrorType {
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
 * Carbone Error class
 *
 * Custom error class for Carbone Integration operations.
 */
export class CarboneError extends Error {
  public readonly code: string | number
  public readonly type: CarboneErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CarboneErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CarboneError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CarboneError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CarboneError instance
   */
  static fromError(error: any): CarboneError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CarboneErrorType; retryable: boolean }> = {
      '401': { type: CarboneErrorType.Authentication, retryable: false },
      '429': { type: CarboneErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CarboneError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CarboneErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CarboneErrorType.Authentication
    } else if (statusCode === 403) {
      type = CarboneErrorType.Authorization
    } else if (statusCode === 404) {
      type = CarboneErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CarboneErrorType.Validation
    } else if (statusCode === 429) {
      type = CarboneErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CarboneErrorType.Server
      retryable = true
    }

    return new CarboneError(message, code, type, {
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
    return this.type === CarboneErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CarboneErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CarboneErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CarboneErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CarboneErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CarboneErrorType.Server
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

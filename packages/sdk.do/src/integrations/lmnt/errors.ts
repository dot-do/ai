/**
 * Lmnt Errors
 *
 * Auto-generated error handling for Lmnt Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/lmnt
 */

/**
 * Error type enum
 */
export enum LmntErrorType {
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
 * Lmnt Error class
 *
 * Custom error class for Lmnt Integration operations.
 */
export class LmntError extends Error {
  public readonly code: string | number
  public readonly type: LmntErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LmntErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LmntError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LmntError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LmntError instance
   */
  static fromError(error: any): LmntError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LmntErrorType; retryable: boolean }> = {
      '401': { type: LmntErrorType.Authentication, retryable: false },
      '429': { type: LmntErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LmntError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LmntErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LmntErrorType.Authentication
    } else if (statusCode === 403) {
      type = LmntErrorType.Authorization
    } else if (statusCode === 404) {
      type = LmntErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LmntErrorType.Validation
    } else if (statusCode === 429) {
      type = LmntErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LmntErrorType.Server
      retryable = true
    }

    return new LmntError(message, code, type, {
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
    return this.type === LmntErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LmntErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LmntErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LmntErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LmntErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LmntErrorType.Server
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

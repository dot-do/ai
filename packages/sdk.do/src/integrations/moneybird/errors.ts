/**
 * Moneybird Errors
 *
 * Auto-generated error handling for Moneybird Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/moneybird
 */

/**
 * Error type enum
 */
export enum MoneybirdErrorType {
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
 * Moneybird Error class
 *
 * Custom error class for Moneybird Integration operations.
 */
export class MoneybirdError extends Error {
  public readonly code: string | number
  public readonly type: MoneybirdErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MoneybirdErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MoneybirdError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MoneybirdError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MoneybirdError instance
   */
  static fromError(error: any): MoneybirdError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MoneybirdErrorType; retryable: boolean }> = {
      '401': { type: MoneybirdErrorType.Authentication, retryable: false },
      '429': { type: MoneybirdErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MoneybirdError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MoneybirdErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MoneybirdErrorType.Authentication
    } else if (statusCode === 403) {
      type = MoneybirdErrorType.Authorization
    } else if (statusCode === 404) {
      type = MoneybirdErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MoneybirdErrorType.Validation
    } else if (statusCode === 429) {
      type = MoneybirdErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MoneybirdErrorType.Server
      retryable = true
    }

    return new MoneybirdError(message, code, type, {
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
    return this.type === MoneybirdErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MoneybirdErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MoneybirdErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MoneybirdErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MoneybirdErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MoneybirdErrorType.Server
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

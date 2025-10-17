/**
 * Adyntel Errors
 *
 * Auto-generated error handling for Adyntel Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/adyntel
 */

/**
 * Error type enum
 */
export enum AdyntelErrorType {
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
 * Adyntel Error class
 *
 * Custom error class for Adyntel Integration operations.
 */
export class AdyntelError extends Error {
  public readonly code: string | number
  public readonly type: AdyntelErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AdyntelErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AdyntelError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AdyntelError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AdyntelError instance
   */
  static fromError(error: any): AdyntelError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AdyntelErrorType; retryable: boolean }> = {
      '401': { type: AdyntelErrorType.Authentication, retryable: false },
      '429': { type: AdyntelErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AdyntelError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AdyntelErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AdyntelErrorType.Authentication
    } else if (statusCode === 403) {
      type = AdyntelErrorType.Authorization
    } else if (statusCode === 404) {
      type = AdyntelErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AdyntelErrorType.Validation
    } else if (statusCode === 429) {
      type = AdyntelErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AdyntelErrorType.Server
      retryable = true
    }

    return new AdyntelError(message, code, type, {
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
    return this.type === AdyntelErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AdyntelErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AdyntelErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AdyntelErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AdyntelErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AdyntelErrorType.Server
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

/**
 * Adrapid Errors
 *
 * Auto-generated error handling for Adrapid Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/adrapid
 */

/**
 * Error type enum
 */
export enum AdrapidErrorType {
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
 * Adrapid Error class
 *
 * Custom error class for Adrapid Integration operations.
 */
export class AdrapidError extends Error {
  public readonly code: string | number
  public readonly type: AdrapidErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AdrapidErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AdrapidError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AdrapidError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AdrapidError instance
   */
  static fromError(error: any): AdrapidError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AdrapidErrorType; retryable: boolean }> = {
      '401': { type: AdrapidErrorType.Authentication, retryable: false },
      '429': { type: AdrapidErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AdrapidError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AdrapidErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AdrapidErrorType.Authentication
    } else if (statusCode === 403) {
      type = AdrapidErrorType.Authorization
    } else if (statusCode === 404) {
      type = AdrapidErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AdrapidErrorType.Validation
    } else if (statusCode === 429) {
      type = AdrapidErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AdrapidErrorType.Server
      retryable = true
    }

    return new AdrapidError(message, code, type, {
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
    return this.type === AdrapidErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AdrapidErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AdrapidErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AdrapidErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AdrapidErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AdrapidErrorType.Server
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

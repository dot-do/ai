/**
 * Google address validation Errors
 *
 * Auto-generated error handling for Google address validation Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/google_address_validation
 */

/**
 * Error type enum
 */
export enum GoogleAddressValidationErrorType {
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
 * Google address validation Error class
 *
 * Custom error class for Google address validation Integration operations.
 */
export class GoogleAddressValidationError extends Error {
  public readonly code: string | number
  public readonly type: GoogleAddressValidationErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GoogleAddressValidationErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GoogleAddressValidationError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GoogleAddressValidationError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GoogleAddressValidationError instance
   */
  static fromError(error: any): GoogleAddressValidationError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GoogleAddressValidationErrorType; retryable: boolean }> = {
      '401': { type: GoogleAddressValidationErrorType.Authentication, retryable: false },
      '429': { type: GoogleAddressValidationErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GoogleAddressValidationError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GoogleAddressValidationErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GoogleAddressValidationErrorType.Authentication
    } else if (statusCode === 403) {
      type = GoogleAddressValidationErrorType.Authorization
    } else if (statusCode === 404) {
      type = GoogleAddressValidationErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GoogleAddressValidationErrorType.Validation
    } else if (statusCode === 429) {
      type = GoogleAddressValidationErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GoogleAddressValidationErrorType.Server
      retryable = true
    }

    return new GoogleAddressValidationError(message, code, type, {
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
    return this.type === GoogleAddressValidationErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GoogleAddressValidationErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GoogleAddressValidationErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GoogleAddressValidationErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GoogleAddressValidationErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GoogleAddressValidationErrorType.Server
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

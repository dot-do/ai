/**
 * Breezy hr Errors
 *
 * Auto-generated error handling for Breezy hr Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/breezy_hr
 */

/**
 * Error type enum
 */
export enum BreezyHrErrorType {
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
 * Breezy hr Error class
 *
 * Custom error class for Breezy hr Integration operations.
 */
export class BreezyHrError extends Error {
  public readonly code: string | number
  public readonly type: BreezyHrErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BreezyHrErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BreezyHrError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BreezyHrError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BreezyHrError instance
   */
  static fromError(error: any): BreezyHrError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BreezyHrErrorType; retryable: boolean }> = {
      '401': { type: BreezyHrErrorType.Authentication, retryable: false },
      '429': { type: BreezyHrErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BreezyHrError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BreezyHrErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BreezyHrErrorType.Authentication
    } else if (statusCode === 403) {
      type = BreezyHrErrorType.Authorization
    } else if (statusCode === 404) {
      type = BreezyHrErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BreezyHrErrorType.Validation
    } else if (statusCode === 429) {
      type = BreezyHrErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BreezyHrErrorType.Server
      retryable = true
    }

    return new BreezyHrError(message, code, type, {
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
    return this.type === BreezyHrErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BreezyHrErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BreezyHrErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BreezyHrErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BreezyHrErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BreezyHrErrorType.Server
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

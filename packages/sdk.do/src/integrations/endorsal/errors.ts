/**
 * Endorsal Errors
 *
 * Auto-generated error handling for Endorsal Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/endorsal
 */

/**
 * Error type enum
 */
export enum EndorsalErrorType {
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
 * Endorsal Error class
 *
 * Custom error class for Endorsal Integration operations.
 */
export class EndorsalError extends Error {
  public readonly code: string | number
  public readonly type: EndorsalErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: EndorsalErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'EndorsalError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EndorsalError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns EndorsalError instance
   */
  static fromError(error: any): EndorsalError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: EndorsalErrorType; retryable: boolean }> = {
      '401': { type: EndorsalErrorType.Authentication, retryable: false },
      '429': { type: EndorsalErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new EndorsalError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = EndorsalErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = EndorsalErrorType.Authentication
    } else if (statusCode === 403) {
      type = EndorsalErrorType.Authorization
    } else if (statusCode === 404) {
      type = EndorsalErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = EndorsalErrorType.Validation
    } else if (statusCode === 429) {
      type = EndorsalErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = EndorsalErrorType.Server
      retryable = true
    }

    return new EndorsalError(message, code, type, {
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
    return this.type === EndorsalErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === EndorsalErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === EndorsalErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === EndorsalErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === EndorsalErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === EndorsalErrorType.Server
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

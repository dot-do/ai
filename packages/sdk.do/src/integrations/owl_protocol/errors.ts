/**
 * Owl protocol Errors
 *
 * Auto-generated error handling for Owl protocol Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/owl_protocol
 */

/**
 * Error type enum
 */
export enum OwlProtocolErrorType {
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
 * Owl protocol Error class
 *
 * Custom error class for Owl protocol Integration operations.
 */
export class OwlProtocolError extends Error {
  public readonly code: string | number
  public readonly type: OwlProtocolErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: OwlProtocolErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'OwlProtocolError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OwlProtocolError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns OwlProtocolError instance
   */
  static fromError(error: any): OwlProtocolError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: OwlProtocolErrorType; retryable: boolean }> = {
      '401': { type: OwlProtocolErrorType.Authentication, retryable: false },
      '429': { type: OwlProtocolErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new OwlProtocolError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = OwlProtocolErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = OwlProtocolErrorType.Authentication
    } else if (statusCode === 403) {
      type = OwlProtocolErrorType.Authorization
    } else if (statusCode === 404) {
      type = OwlProtocolErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = OwlProtocolErrorType.Validation
    } else if (statusCode === 429) {
      type = OwlProtocolErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = OwlProtocolErrorType.Server
      retryable = true
    }

    return new OwlProtocolError(message, code, type, {
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
    return this.type === OwlProtocolErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === OwlProtocolErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === OwlProtocolErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === OwlProtocolErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === OwlProtocolErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === OwlProtocolErrorType.Server
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

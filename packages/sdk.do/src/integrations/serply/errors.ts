/**
 * Serply Errors
 *
 * Auto-generated error handling for Serply Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/serply
 */

/**
 * Error type enum
 */
export enum SerplyErrorType {
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
 * Serply Error class
 *
 * Custom error class for Serply Integration operations.
 */
export class SerplyError extends Error {
  public readonly code: string | number
  public readonly type: SerplyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SerplyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SerplyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SerplyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SerplyError instance
   */
  static fromError(error: any): SerplyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SerplyErrorType; retryable: boolean }> = {
      '401': { type: SerplyErrorType.Authentication, retryable: false },
      '429': { type: SerplyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SerplyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SerplyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SerplyErrorType.Authentication
    } else if (statusCode === 403) {
      type = SerplyErrorType.Authorization
    } else if (statusCode === 404) {
      type = SerplyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SerplyErrorType.Validation
    } else if (statusCode === 429) {
      type = SerplyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SerplyErrorType.Server
      retryable = true
    }

    return new SerplyError(message, code, type, {
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
    return this.type === SerplyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SerplyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SerplyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SerplyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SerplyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SerplyErrorType.Server
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

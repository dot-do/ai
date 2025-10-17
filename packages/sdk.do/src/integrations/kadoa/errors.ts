/**
 * Kadoa Errors
 *
 * Auto-generated error handling for Kadoa Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/kadoa
 */

/**
 * Error type enum
 */
export enum KadoaErrorType {
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
 * Kadoa Error class
 *
 * Custom error class for Kadoa Integration operations.
 */
export class KadoaError extends Error {
  public readonly code: string | number
  public readonly type: KadoaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: KadoaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'KadoaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KadoaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns KadoaError instance
   */
  static fromError(error: any): KadoaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: KadoaErrorType; retryable: boolean }> = {
      '401': { type: KadoaErrorType.Authentication, retryable: false },
      '429': { type: KadoaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new KadoaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = KadoaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = KadoaErrorType.Authentication
    } else if (statusCode === 403) {
      type = KadoaErrorType.Authorization
    } else if (statusCode === 404) {
      type = KadoaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = KadoaErrorType.Validation
    } else if (statusCode === 429) {
      type = KadoaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = KadoaErrorType.Server
      retryable = true
    }

    return new KadoaError(message, code, type, {
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
    return this.type === KadoaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === KadoaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === KadoaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === KadoaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === KadoaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === KadoaErrorType.Server
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

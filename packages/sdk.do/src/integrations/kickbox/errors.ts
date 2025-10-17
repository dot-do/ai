/**
 * Kickbox Errors
 *
 * Auto-generated error handling for Kickbox Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/kickbox
 */

/**
 * Error type enum
 */
export enum KickboxErrorType {
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
 * Kickbox Error class
 *
 * Custom error class for Kickbox Integration operations.
 */
export class KickboxError extends Error {
  public readonly code: string | number
  public readonly type: KickboxErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: KickboxErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'KickboxError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KickboxError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns KickboxError instance
   */
  static fromError(error: any): KickboxError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: KickboxErrorType; retryable: boolean }> = {
      '401': { type: KickboxErrorType.Authentication, retryable: false },
      '429': { type: KickboxErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new KickboxError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = KickboxErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = KickboxErrorType.Authentication
    } else if (statusCode === 403) {
      type = KickboxErrorType.Authorization
    } else if (statusCode === 404) {
      type = KickboxErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = KickboxErrorType.Validation
    } else if (statusCode === 429) {
      type = KickboxErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = KickboxErrorType.Server
      retryable = true
    }

    return new KickboxError(message, code, type, {
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
    return this.type === KickboxErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === KickboxErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === KickboxErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === KickboxErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === KickboxErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === KickboxErrorType.Server
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

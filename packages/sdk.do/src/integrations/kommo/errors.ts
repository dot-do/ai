/**
 * Kommo Errors
 *
 * Auto-generated error handling for Kommo Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/kommo
 */

/**
 * Error type enum
 */
export enum KommoErrorType {
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
 * Kommo Error class
 *
 * Custom error class for Kommo Integration operations.
 */
export class KommoError extends Error {
  public readonly code: string | number
  public readonly type: KommoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: KommoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'KommoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KommoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns KommoError instance
   */
  static fromError(error: any): KommoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: KommoErrorType; retryable: boolean }> = {
      '401': { type: KommoErrorType.Authentication, retryable: false },
      '429': { type: KommoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new KommoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = KommoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = KommoErrorType.Authentication
    } else if (statusCode === 403) {
      type = KommoErrorType.Authorization
    } else if (statusCode === 404) {
      type = KommoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = KommoErrorType.Validation
    } else if (statusCode === 429) {
      type = KommoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = KommoErrorType.Server
      retryable = true
    }

    return new KommoError(message, code, type, {
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
    return this.type === KommoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === KommoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === KommoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === KommoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === KommoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === KommoErrorType.Server
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

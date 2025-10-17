/**
 * Kit Errors
 *
 * Auto-generated error handling for Kit Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/kit
 */

/**
 * Error type enum
 */
export enum KitErrorType {
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
 * Kit Error class
 *
 * Custom error class for Kit Integration operations.
 */
export class KitError extends Error {
  public readonly code: string | number
  public readonly type: KitErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: KitErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'KitError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KitError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns KitError instance
   */
  static fromError(error: any): KitError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: KitErrorType; retryable: boolean }> = {
      '401': { type: KitErrorType.Authentication, retryable: false },
      '429': { type: KitErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new KitError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = KitErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = KitErrorType.Authentication
    } else if (statusCode === 403) {
      type = KitErrorType.Authorization
    } else if (statusCode === 404) {
      type = KitErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = KitErrorType.Validation
    } else if (statusCode === 429) {
      type = KitErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = KitErrorType.Server
      retryable = true
    }

    return new KitError(message, code, type, {
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
    return this.type === KitErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === KitErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === KitErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === KitErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === KitErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === KitErrorType.Server
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

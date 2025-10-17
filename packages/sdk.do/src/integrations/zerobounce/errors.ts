/**
 * Zerobounce Errors
 *
 * Auto-generated error handling for Zerobounce Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/zerobounce
 */

/**
 * Error type enum
 */
export enum ZerobounceErrorType {
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
 * Zerobounce Error class
 *
 * Custom error class for Zerobounce Integration operations.
 */
export class ZerobounceError extends Error {
  public readonly code: string | number
  public readonly type: ZerobounceErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ZerobounceErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ZerobounceError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZerobounceError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ZerobounceError instance
   */
  static fromError(error: any): ZerobounceError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ZerobounceErrorType; retryable: boolean }> = {
      '401': { type: ZerobounceErrorType.Authentication, retryable: false },
      '429': { type: ZerobounceErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ZerobounceError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ZerobounceErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ZerobounceErrorType.Authentication
    } else if (statusCode === 403) {
      type = ZerobounceErrorType.Authorization
    } else if (statusCode === 404) {
      type = ZerobounceErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ZerobounceErrorType.Validation
    } else if (statusCode === 429) {
      type = ZerobounceErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ZerobounceErrorType.Server
      retryable = true
    }

    return new ZerobounceError(message, code, type, {
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
    return this.type === ZerobounceErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ZerobounceErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ZerobounceErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ZerobounceErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ZerobounceErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ZerobounceErrorType.Server
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

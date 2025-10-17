/**
 * Zoho bigin Errors
 *
 * Auto-generated error handling for Zoho bigin Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/zoho_bigin
 */

/**
 * Error type enum
 */
export enum ZohoBiginErrorType {
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
 * Zoho bigin Error class
 *
 * Custom error class for Zoho bigin Integration operations.
 */
export class ZohoBiginError extends Error {
  public readonly code: string | number
  public readonly type: ZohoBiginErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ZohoBiginErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ZohoBiginError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZohoBiginError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ZohoBiginError instance
   */
  static fromError(error: any): ZohoBiginError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ZohoBiginErrorType; retryable: boolean }> = {
      '401': { type: ZohoBiginErrorType.Authentication, retryable: false },
      '429': { type: ZohoBiginErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ZohoBiginError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ZohoBiginErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ZohoBiginErrorType.Authentication
    } else if (statusCode === 403) {
      type = ZohoBiginErrorType.Authorization
    } else if (statusCode === 404) {
      type = ZohoBiginErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ZohoBiginErrorType.Validation
    } else if (statusCode === 429) {
      type = ZohoBiginErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ZohoBiginErrorType.Server
      retryable = true
    }

    return new ZohoBiginError(message, code, type, {
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
    return this.type === ZohoBiginErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ZohoBiginErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ZohoBiginErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ZohoBiginErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ZohoBiginErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ZohoBiginErrorType.Server
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

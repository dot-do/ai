/**
 * Zoho books Errors
 *
 * Auto-generated error handling for Zoho books Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/zoho_books
 */

/**
 * Error type enum
 */
export enum ZohoBooksErrorType {
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
 * Zoho books Error class
 *
 * Custom error class for Zoho books Integration operations.
 */
export class ZohoBooksError extends Error {
  public readonly code: string | number
  public readonly type: ZohoBooksErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ZohoBooksErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ZohoBooksError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZohoBooksError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ZohoBooksError instance
   */
  static fromError(error: any): ZohoBooksError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ZohoBooksErrorType; retryable: boolean }> = {
      '401': { type: ZohoBooksErrorType.Authentication, retryable: false },
      '429': { type: ZohoBooksErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ZohoBooksError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ZohoBooksErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ZohoBooksErrorType.Authentication
    } else if (statusCode === 403) {
      type = ZohoBooksErrorType.Authorization
    } else if (statusCode === 404) {
      type = ZohoBooksErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ZohoBooksErrorType.Validation
    } else if (statusCode === 429) {
      type = ZohoBooksErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ZohoBooksErrorType.Server
      retryable = true
    }

    return new ZohoBooksError(message, code, type, {
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
    return this.type === ZohoBooksErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ZohoBooksErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ZohoBooksErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ZohoBooksErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ZohoBooksErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ZohoBooksErrorType.Server
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

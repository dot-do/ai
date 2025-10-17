/**
 * Mem Errors
 *
 * Auto-generated error handling for Mem Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mem
 */

/**
 * Error type enum
 */
export enum MemErrorType {
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
 * Mem Error class
 *
 * Custom error class for Mem Integration operations.
 */
export class MemError extends Error {
  public readonly code: string | number
  public readonly type: MemErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MemErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MemError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MemError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MemError instance
   */
  static fromError(error: any): MemError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MemErrorType; retryable: boolean }> = {
      '401': { type: MemErrorType.Authentication, retryable: false },
      '429': { type: MemErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MemError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MemErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MemErrorType.Authentication
    } else if (statusCode === 403) {
      type = MemErrorType.Authorization
    } else if (statusCode === 404) {
      type = MemErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MemErrorType.Validation
    } else if (statusCode === 429) {
      type = MemErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MemErrorType.Server
      retryable = true
    }

    return new MemError(message, code, type, {
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
    return this.type === MemErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MemErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MemErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MemErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MemErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MemErrorType.Server
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

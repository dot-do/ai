/**
 * Gong Errors
 *
 * Auto-generated error handling for Gong Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/gong
 */

/**
 * Error type enum
 */
export enum GongErrorType {
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
 * Gong Error class
 *
 * Custom error class for Gong Integration operations.
 */
export class GongError extends Error {
  public readonly code: string | number
  public readonly type: GongErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GongErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GongError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GongError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GongError instance
   */
  static fromError(error: any): GongError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GongErrorType; retryable: boolean }> = {
      '401': { type: GongErrorType.Authentication, retryable: false },
      '429': { type: GongErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GongError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GongErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GongErrorType.Authentication
    } else if (statusCode === 403) {
      type = GongErrorType.Authorization
    } else if (statusCode === 404) {
      type = GongErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GongErrorType.Validation
    } else if (statusCode === 429) {
      type = GongErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GongErrorType.Server
      retryable = true
    }

    return new GongError(message, code, type, {
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
    return this.type === GongErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GongErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GongErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GongErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GongErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GongErrorType.Server
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

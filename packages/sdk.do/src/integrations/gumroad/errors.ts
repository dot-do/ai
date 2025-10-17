/**
 * Gumroad Errors
 *
 * Auto-generated error handling for Gumroad Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/gumroad
 */

/**
 * Error type enum
 */
export enum GumroadErrorType {
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
 * Gumroad Error class
 *
 * Custom error class for Gumroad Integration operations.
 */
export class GumroadError extends Error {
  public readonly code: string | number
  public readonly type: GumroadErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GumroadErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GumroadError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GumroadError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GumroadError instance
   */
  static fromError(error: any): GumroadError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GumroadErrorType; retryable: boolean }> = {
      '401': { type: GumroadErrorType.Authentication, retryable: false },
      '429': { type: GumroadErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GumroadError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GumroadErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GumroadErrorType.Authentication
    } else if (statusCode === 403) {
      type = GumroadErrorType.Authorization
    } else if (statusCode === 404) {
      type = GumroadErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GumroadErrorType.Validation
    } else if (statusCode === 429) {
      type = GumroadErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GumroadErrorType.Server
      retryable = true
    }

    return new GumroadError(message, code, type, {
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
    return this.type === GumroadErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GumroadErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GumroadErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GumroadErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GumroadErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GumroadErrorType.Server
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

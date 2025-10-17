/**
 * Gagelist Errors
 *
 * Auto-generated error handling for Gagelist Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/gagelist
 */

/**
 * Error type enum
 */
export enum GagelistErrorType {
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
 * Gagelist Error class
 *
 * Custom error class for Gagelist Integration operations.
 */
export class GagelistError extends Error {
  public readonly code: string | number
  public readonly type: GagelistErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GagelistErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GagelistError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GagelistError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GagelistError instance
   */
  static fromError(error: any): GagelistError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GagelistErrorType; retryable: boolean }> = {
      '401': { type: GagelistErrorType.Authentication, retryable: false },
      '429': { type: GagelistErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GagelistError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GagelistErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GagelistErrorType.Authentication
    } else if (statusCode === 403) {
      type = GagelistErrorType.Authorization
    } else if (statusCode === 404) {
      type = GagelistErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GagelistErrorType.Validation
    } else if (statusCode === 429) {
      type = GagelistErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GagelistErrorType.Server
      retryable = true
    }

    return new GagelistError(message, code, type, {
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
    return this.type === GagelistErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GagelistErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GagelistErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GagelistErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GagelistErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GagelistErrorType.Server
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

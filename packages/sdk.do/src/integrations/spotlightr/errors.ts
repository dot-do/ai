/**
 * Spotlightr Errors
 *
 * Auto-generated error handling for Spotlightr Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/spotlightr
 */

/**
 * Error type enum
 */
export enum SpotlightrErrorType {
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
 * Spotlightr Error class
 *
 * Custom error class for Spotlightr Integration operations.
 */
export class SpotlightrError extends Error {
  public readonly code: string | number
  public readonly type: SpotlightrErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SpotlightrErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SpotlightrError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SpotlightrError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SpotlightrError instance
   */
  static fromError(error: any): SpotlightrError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SpotlightrErrorType; retryable: boolean }> = {
      '401': { type: SpotlightrErrorType.Authentication, retryable: false },
      '429': { type: SpotlightrErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SpotlightrError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SpotlightrErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SpotlightrErrorType.Authentication
    } else if (statusCode === 403) {
      type = SpotlightrErrorType.Authorization
    } else if (statusCode === 404) {
      type = SpotlightrErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SpotlightrErrorType.Validation
    } else if (statusCode === 429) {
      type = SpotlightrErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SpotlightrErrorType.Server
      retryable = true
    }

    return new SpotlightrError(message, code, type, {
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
    return this.type === SpotlightrErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SpotlightrErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SpotlightrErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SpotlightrErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SpotlightrErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SpotlightrErrorType.Server
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

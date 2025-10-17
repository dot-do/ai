/**
 * Spotify Errors
 *
 * Auto-generated error handling for Spotify Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/spotify
 */

/**
 * Error type enum
 */
export enum SpotifyErrorType {
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
 * Spotify Error class
 *
 * Custom error class for Spotify Integration operations.
 */
export class SpotifyError extends Error {
  public readonly code: string | number
  public readonly type: SpotifyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SpotifyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SpotifyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SpotifyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SpotifyError instance
   */
  static fromError(error: any): SpotifyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SpotifyErrorType; retryable: boolean }> = {
      '401': { type: SpotifyErrorType.Authentication, retryable: false },
      '429': { type: SpotifyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SpotifyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SpotifyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SpotifyErrorType.Authentication
    } else if (statusCode === 403) {
      type = SpotifyErrorType.Authorization
    } else if (statusCode === 404) {
      type = SpotifyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SpotifyErrorType.Validation
    } else if (statusCode === 429) {
      type = SpotifyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SpotifyErrorType.Server
      retryable = true
    }

    return new SpotifyError(message, code, type, {
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
    return this.type === SpotifyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SpotifyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SpotifyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SpotifyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SpotifyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SpotifyErrorType.Server
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

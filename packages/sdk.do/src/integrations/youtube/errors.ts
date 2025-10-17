/**
 * Youtube Errors
 *
 * Auto-generated error handling for Youtube Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/youtube
 */

/**
 * Error type enum
 */
export enum YoutubeErrorType {
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
 * Youtube Error class
 *
 * Custom error class for Youtube Integration operations.
 */
export class YoutubeError extends Error {
  public readonly code: string | number
  public readonly type: YoutubeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: YoutubeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'YoutubeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, YoutubeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns YoutubeError instance
   */
  static fromError(error: any): YoutubeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: YoutubeErrorType; retryable: boolean }> = {
      '401': { type: YoutubeErrorType.Authentication, retryable: false },
      '429': { type: YoutubeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new YoutubeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = YoutubeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = YoutubeErrorType.Authentication
    } else if (statusCode === 403) {
      type = YoutubeErrorType.Authorization
    } else if (statusCode === 404) {
      type = YoutubeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = YoutubeErrorType.Validation
    } else if (statusCode === 429) {
      type = YoutubeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = YoutubeErrorType.Server
      retryable = true
    }

    return new YoutubeError(message, code, type, {
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
    return this.type === YoutubeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === YoutubeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === YoutubeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === YoutubeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === YoutubeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === YoutubeErrorType.Server
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

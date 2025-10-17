/**
 * Googlephotos Errors
 *
 * Auto-generated error handling for Googlephotos Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/googlephotos
 */

/**
 * Error type enum
 */
export enum GooglephotosErrorType {
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
 * Googlephotos Error class
 *
 * Custom error class for Googlephotos Integration operations.
 */
export class GooglephotosError extends Error {
  public readonly code: string | number
  public readonly type: GooglephotosErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GooglephotosErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GooglephotosError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GooglephotosError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GooglephotosError instance
   */
  static fromError(error: any): GooglephotosError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GooglephotosErrorType; retryable: boolean }> = {
      '401': { type: GooglephotosErrorType.Authentication, retryable: false },
      '429': { type: GooglephotosErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GooglephotosError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GooglephotosErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GooglephotosErrorType.Authentication
    } else if (statusCode === 403) {
      type = GooglephotosErrorType.Authorization
    } else if (statusCode === 404) {
      type = GooglephotosErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GooglephotosErrorType.Validation
    } else if (statusCode === 429) {
      type = GooglephotosErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GooglephotosErrorType.Server
      retryable = true
    }

    return new GooglephotosError(message, code, type, {
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
    return this.type === GooglephotosErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GooglephotosErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GooglephotosErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GooglephotosErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GooglephotosErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GooglephotosErrorType.Server
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

/**
 * Gist Errors
 *
 * Auto-generated error handling for Gist Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/gist
 */

/**
 * Error type enum
 */
export enum GistErrorType {
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
 * Gist Error class
 *
 * Custom error class for Gist Integration operations.
 */
export class GistError extends Error {
  public readonly code: string | number
  public readonly type: GistErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GistErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GistError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GistError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GistError instance
   */
  static fromError(error: any): GistError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GistErrorType; retryable: boolean }> = {
      '401': { type: GistErrorType.Authentication, retryable: false },
      '429': { type: GistErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GistError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GistErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GistErrorType.Authentication
    } else if (statusCode === 403) {
      type = GistErrorType.Authorization
    } else if (statusCode === 404) {
      type = GistErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GistErrorType.Validation
    } else if (statusCode === 429) {
      type = GistErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GistErrorType.Server
      retryable = true
    }

    return new GistError(message, code, type, {
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
    return this.type === GistErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GistErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GistErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GistErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GistErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GistErrorType.Server
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

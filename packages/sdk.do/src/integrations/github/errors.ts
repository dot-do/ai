/**
 * GitHub Errors
 *
 * Auto-generated error handling for GitHub Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/github
 */

/**
 * Error type enum
 */
export enum GithubErrorType {
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
 * GitHub Error class
 *
 * Custom error class for GitHub Integration operations.
 */
export class GithubError extends Error {
  public readonly code: string | number
  public readonly type: GithubErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GithubErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GithubError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GithubError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GithubError instance
   */
  static fromError(error: any): GithubError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GithubErrorType; retryable: boolean }> = {
      unauthorized: { type: GithubErrorType.Authentication, retryable: false },
      forbidden: { type: GithubErrorType.Authorization, retryable: false },
      rate_limit_exceeded: { type: GithubErrorType.RateLimit, retryable: true },
      not_found: { type: GithubErrorType.NotFound, retryable: false },
      validation_failed: { type: GithubErrorType.Validation, retryable: false },
      conflict: { type: GithubErrorType.Validation, retryable: false },
      server_error: { type: GithubErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GithubError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GithubErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GithubErrorType.Authentication
    } else if (statusCode === 403) {
      type = GithubErrorType.Authorization
    } else if (statusCode === 404) {
      type = GithubErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GithubErrorType.Validation
    } else if (statusCode === 429) {
      type = GithubErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GithubErrorType.Server
      retryable = true
    }

    return new GithubError(message, code, type, {
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
    return this.type === GithubErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GithubErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GithubErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GithubErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GithubErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GithubErrorType.Server
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

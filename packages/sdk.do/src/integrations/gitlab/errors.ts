/**
 * GitLab Errors
 *
 * Auto-generated error handling for GitLab Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/gitlab
 */

/**
 * Error type enum
 */
export enum GitlabErrorType {
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
 * GitLab Error class
 *
 * Custom error class for GitLab Integration operations.
 */
export class GitlabError extends Error {
  public readonly code: string | number
  public readonly type: GitlabErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GitlabErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GitlabError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GitlabError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GitlabError instance
   */
  static fromError(error: any): GitlabError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GitlabErrorType; retryable: boolean }> = {
      '401': { type: GitlabErrorType.Authentication, retryable: false },
      '403': { type: GitlabErrorType.Authorization, retryable: false },
      '404': { type: GitlabErrorType.NotFound, retryable: false },
      '400': { type: GitlabErrorType.Validation, retryable: false },
      '429': { type: GitlabErrorType.RateLimit, retryable: true },
      '500': { type: GitlabErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GitlabError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GitlabErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GitlabErrorType.Authentication
    } else if (statusCode === 403) {
      type = GitlabErrorType.Authorization
    } else if (statusCode === 404) {
      type = GitlabErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GitlabErrorType.Validation
    } else if (statusCode === 429) {
      type = GitlabErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GitlabErrorType.Server
      retryable = true
    }

    return new GitlabError(message, code, type, {
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
    return this.type === GitlabErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GitlabErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GitlabErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GitlabErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GitlabErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GitlabErrorType.Server
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

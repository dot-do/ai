/**
 * Buildkite Errors
 *
 * Auto-generated error handling for Buildkite Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/buildkite
 */

/**
 * Error type enum
 */
export enum BuildkiteErrorType {
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
 * Buildkite Error class
 *
 * Custom error class for Buildkite Integration operations.
 */
export class BuildkiteError extends Error {
  public readonly code: string | number
  public readonly type: BuildkiteErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BuildkiteErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BuildkiteError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BuildkiteError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BuildkiteError instance
   */
  static fromError(error: any): BuildkiteError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BuildkiteErrorType; retryable: boolean }> = {
      '401': { type: BuildkiteErrorType.Authentication, retryable: false },
      '429': { type: BuildkiteErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BuildkiteError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BuildkiteErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BuildkiteErrorType.Authentication
    } else if (statusCode === 403) {
      type = BuildkiteErrorType.Authorization
    } else if (statusCode === 404) {
      type = BuildkiteErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BuildkiteErrorType.Validation
    } else if (statusCode === 429) {
      type = BuildkiteErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BuildkiteErrorType.Server
      retryable = true
    }

    return new BuildkiteError(message, code, type, {
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
    return this.type === BuildkiteErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BuildkiteErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BuildkiteErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BuildkiteErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BuildkiteErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BuildkiteErrorType.Server
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

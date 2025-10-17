/**
 * Sourcegraph Errors
 *
 * Auto-generated error handling for Sourcegraph Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sourcegraph
 */

/**
 * Error type enum
 */
export enum SourcegraphErrorType {
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
 * Sourcegraph Error class
 *
 * Custom error class for Sourcegraph Integration operations.
 */
export class SourcegraphError extends Error {
  public readonly code: string | number
  public readonly type: SourcegraphErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SourcegraphErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SourcegraphError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SourcegraphError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SourcegraphError instance
   */
  static fromError(error: any): SourcegraphError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SourcegraphErrorType; retryable: boolean }> = {
      '401': { type: SourcegraphErrorType.Authentication, retryable: false },
      '429': { type: SourcegraphErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SourcegraphError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SourcegraphErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SourcegraphErrorType.Authentication
    } else if (statusCode === 403) {
      type = SourcegraphErrorType.Authorization
    } else if (statusCode === 404) {
      type = SourcegraphErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SourcegraphErrorType.Validation
    } else if (statusCode === 429) {
      type = SourcegraphErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SourcegraphErrorType.Server
      retryable = true
    }

    return new SourcegraphError(message, code, type, {
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
    return this.type === SourcegraphErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SourcegraphErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SourcegraphErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SourcegraphErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SourcegraphErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SourcegraphErrorType.Server
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

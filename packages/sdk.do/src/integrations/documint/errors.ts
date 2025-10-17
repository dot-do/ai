/**
 * Documint Errors
 *
 * Auto-generated error handling for Documint Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/documint
 */

/**
 * Error type enum
 */
export enum DocumintErrorType {
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
 * Documint Error class
 *
 * Custom error class for Documint Integration operations.
 */
export class DocumintError extends Error {
  public readonly code: string | number
  public readonly type: DocumintErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DocumintErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DocumintError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DocumintError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DocumintError instance
   */
  static fromError(error: any): DocumintError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DocumintErrorType; retryable: boolean }> = {
      '401': { type: DocumintErrorType.Authentication, retryable: false },
      '429': { type: DocumintErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DocumintError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DocumintErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DocumintErrorType.Authentication
    } else if (statusCode === 403) {
      type = DocumintErrorType.Authorization
    } else if (statusCode === 404) {
      type = DocumintErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DocumintErrorType.Validation
    } else if (statusCode === 429) {
      type = DocumintErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DocumintErrorType.Server
      retryable = true
    }

    return new DocumintError(message, code, type, {
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
    return this.type === DocumintErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DocumintErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DocumintErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DocumintErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DocumintErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DocumintErrorType.Server
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

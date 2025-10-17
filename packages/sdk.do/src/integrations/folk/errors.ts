/**
 * Folk Errors
 *
 * Auto-generated error handling for Folk Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/folk
 */

/**
 * Error type enum
 */
export enum FolkErrorType {
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
 * Folk Error class
 *
 * Custom error class for Folk Integration operations.
 */
export class FolkError extends Error {
  public readonly code: string | number
  public readonly type: FolkErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FolkErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FolkError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FolkError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FolkError instance
   */
  static fromError(error: any): FolkError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FolkErrorType; retryable: boolean }> = {
      '401': { type: FolkErrorType.Authentication, retryable: false },
      '429': { type: FolkErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FolkError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FolkErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FolkErrorType.Authentication
    } else if (statusCode === 403) {
      type = FolkErrorType.Authorization
    } else if (statusCode === 404) {
      type = FolkErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FolkErrorType.Validation
    } else if (statusCode === 429) {
      type = FolkErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FolkErrorType.Server
      retryable = true
    }

    return new FolkError(message, code, type, {
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
    return this.type === FolkErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FolkErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FolkErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FolkErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FolkErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FolkErrorType.Server
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

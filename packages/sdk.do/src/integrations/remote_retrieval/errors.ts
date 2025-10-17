/**
 * Remote retrieval Errors
 *
 * Auto-generated error handling for Remote retrieval Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/remote_retrieval
 */

/**
 * Error type enum
 */
export enum RemoteRetrievalErrorType {
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
 * Remote retrieval Error class
 *
 * Custom error class for Remote retrieval Integration operations.
 */
export class RemoteRetrievalError extends Error {
  public readonly code: string | number
  public readonly type: RemoteRetrievalErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RemoteRetrievalErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RemoteRetrievalError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RemoteRetrievalError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RemoteRetrievalError instance
   */
  static fromError(error: any): RemoteRetrievalError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RemoteRetrievalErrorType; retryable: boolean }> = {
      '401': { type: RemoteRetrievalErrorType.Authentication, retryable: false },
      '429': { type: RemoteRetrievalErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RemoteRetrievalError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RemoteRetrievalErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RemoteRetrievalErrorType.Authentication
    } else if (statusCode === 403) {
      type = RemoteRetrievalErrorType.Authorization
    } else if (statusCode === 404) {
      type = RemoteRetrievalErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RemoteRetrievalErrorType.Validation
    } else if (statusCode === 429) {
      type = RemoteRetrievalErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RemoteRetrievalErrorType.Server
      retryable = true
    }

    return new RemoteRetrievalError(message, code, type, {
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
    return this.type === RemoteRetrievalErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RemoteRetrievalErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RemoteRetrievalErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RemoteRetrievalErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RemoteRetrievalErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RemoteRetrievalErrorType.Server
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

/**
 * Chatwork Errors
 *
 * Auto-generated error handling for Chatwork Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/chatwork
 */

/**
 * Error type enum
 */
export enum ChatworkErrorType {
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
 * Chatwork Error class
 *
 * Custom error class for Chatwork Integration operations.
 */
export class ChatworkError extends Error {
  public readonly code: string | number
  public readonly type: ChatworkErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ChatworkErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ChatworkError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ChatworkError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ChatworkError instance
   */
  static fromError(error: any): ChatworkError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ChatworkErrorType; retryable: boolean }> = {
      '401': { type: ChatworkErrorType.Authentication, retryable: false },
      '429': { type: ChatworkErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ChatworkError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ChatworkErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ChatworkErrorType.Authentication
    } else if (statusCode === 403) {
      type = ChatworkErrorType.Authorization
    } else if (statusCode === 404) {
      type = ChatworkErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ChatworkErrorType.Validation
    } else if (statusCode === 429) {
      type = ChatworkErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ChatworkErrorType.Server
      retryable = true
    }

    return new ChatworkError(message, code, type, {
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
    return this.type === ChatworkErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ChatworkErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ChatworkErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ChatworkErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ChatworkErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ChatworkErrorType.Server
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

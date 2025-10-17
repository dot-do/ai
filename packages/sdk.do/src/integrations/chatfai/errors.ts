/**
 * Chatfai Errors
 *
 * Auto-generated error handling for Chatfai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/chatfai
 */

/**
 * Error type enum
 */
export enum ChatfaiErrorType {
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
 * Chatfai Error class
 *
 * Custom error class for Chatfai Integration operations.
 */
export class ChatfaiError extends Error {
  public readonly code: string | number
  public readonly type: ChatfaiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ChatfaiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ChatfaiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ChatfaiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ChatfaiError instance
   */
  static fromError(error: any): ChatfaiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ChatfaiErrorType; retryable: boolean }> = {
      '401': { type: ChatfaiErrorType.Authentication, retryable: false },
      '429': { type: ChatfaiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ChatfaiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ChatfaiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ChatfaiErrorType.Authentication
    } else if (statusCode === 403) {
      type = ChatfaiErrorType.Authorization
    } else if (statusCode === 404) {
      type = ChatfaiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ChatfaiErrorType.Validation
    } else if (statusCode === 429) {
      type = ChatfaiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ChatfaiErrorType.Server
      retryable = true
    }

    return new ChatfaiError(message, code, type, {
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
    return this.type === ChatfaiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ChatfaiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ChatfaiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ChatfaiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ChatfaiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ChatfaiErrorType.Server
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

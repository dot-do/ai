/**
 * Chatbotkit Errors
 *
 * Auto-generated error handling for Chatbotkit Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/chatbotkit
 */

/**
 * Error type enum
 */
export enum ChatbotkitErrorType {
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
 * Chatbotkit Error class
 *
 * Custom error class for Chatbotkit Integration operations.
 */
export class ChatbotkitError extends Error {
  public readonly code: string | number
  public readonly type: ChatbotkitErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ChatbotkitErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ChatbotkitError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ChatbotkitError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ChatbotkitError instance
   */
  static fromError(error: any): ChatbotkitError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ChatbotkitErrorType; retryable: boolean }> = {
      '401': { type: ChatbotkitErrorType.Authentication, retryable: false },
      '429': { type: ChatbotkitErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ChatbotkitError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ChatbotkitErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ChatbotkitErrorType.Authentication
    } else if (statusCode === 403) {
      type = ChatbotkitErrorType.Authorization
    } else if (statusCode === 404) {
      type = ChatbotkitErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ChatbotkitErrorType.Validation
    } else if (statusCode === 429) {
      type = ChatbotkitErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ChatbotkitErrorType.Server
      retryable = true
    }

    return new ChatbotkitError(message, code, type, {
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
    return this.type === ChatbotkitErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ChatbotkitErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ChatbotkitErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ChatbotkitErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ChatbotkitErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ChatbotkitErrorType.Server
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

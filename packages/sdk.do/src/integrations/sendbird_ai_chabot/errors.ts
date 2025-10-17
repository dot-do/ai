/**
 * Sendbird ai chabot Errors
 *
 * Auto-generated error handling for Sendbird ai chabot Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sendbird_ai_chabot
 */

/**
 * Error type enum
 */
export enum SendbirdAiChabotErrorType {
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
 * Sendbird ai chabot Error class
 *
 * Custom error class for Sendbird ai chabot Integration operations.
 */
export class SendbirdAiChabotError extends Error {
  public readonly code: string | number
  public readonly type: SendbirdAiChabotErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SendbirdAiChabotErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SendbirdAiChabotError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SendbirdAiChabotError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SendbirdAiChabotError instance
   */
  static fromError(error: any): SendbirdAiChabotError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SendbirdAiChabotErrorType; retryable: boolean }> = {
      '401': { type: SendbirdAiChabotErrorType.Authentication, retryable: false },
      '429': { type: SendbirdAiChabotErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SendbirdAiChabotError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SendbirdAiChabotErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SendbirdAiChabotErrorType.Authentication
    } else if (statusCode === 403) {
      type = SendbirdAiChabotErrorType.Authorization
    } else if (statusCode === 404) {
      type = SendbirdAiChabotErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SendbirdAiChabotErrorType.Validation
    } else if (statusCode === 429) {
      type = SendbirdAiChabotErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SendbirdAiChabotErrorType.Server
      retryable = true
    }

    return new SendbirdAiChabotError(message, code, type, {
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
    return this.type === SendbirdAiChabotErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SendbirdAiChabotErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SendbirdAiChabotErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SendbirdAiChabotErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SendbirdAiChabotErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SendbirdAiChabotErrorType.Server
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

/**
 * Textcortex Errors
 *
 * Auto-generated error handling for Textcortex Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/textcortex
 */

/**
 * Error type enum
 */
export enum TextcortexErrorType {
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
 * Textcortex Error class
 *
 * Custom error class for Textcortex Integration operations.
 */
export class TextcortexError extends Error {
  public readonly code: string | number
  public readonly type: TextcortexErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TextcortexErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TextcortexError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TextcortexError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TextcortexError instance
   */
  static fromError(error: any): TextcortexError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TextcortexErrorType; retryable: boolean }> = {
      '401': { type: TextcortexErrorType.Authentication, retryable: false },
      '429': { type: TextcortexErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TextcortexError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TextcortexErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TextcortexErrorType.Authentication
    } else if (statusCode === 403) {
      type = TextcortexErrorType.Authorization
    } else if (statusCode === 404) {
      type = TextcortexErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TextcortexErrorType.Validation
    } else if (statusCode === 429) {
      type = TextcortexErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TextcortexErrorType.Server
      retryable = true
    }

    return new TextcortexError(message, code, type, {
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
    return this.type === TextcortexErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TextcortexErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TextcortexErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TextcortexErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TextcortexErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TextcortexErrorType.Server
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

/**
 * Text to pdf Errors
 *
 * Auto-generated error handling for Text to pdf Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/text_to_pdf
 */

/**
 * Error type enum
 */
export enum TextToPdfErrorType {
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
 * Text to pdf Error class
 *
 * Custom error class for Text to pdf Integration operations.
 */
export class TextToPdfError extends Error {
  public readonly code: string | number
  public readonly type: TextToPdfErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TextToPdfErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TextToPdfError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TextToPdfError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TextToPdfError instance
   */
  static fromError(error: any): TextToPdfError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TextToPdfErrorType; retryable: boolean }> = {
      '401': { type: TextToPdfErrorType.Authentication, retryable: false },
      '429': { type: TextToPdfErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TextToPdfError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TextToPdfErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TextToPdfErrorType.Authentication
    } else if (statusCode === 403) {
      type = TextToPdfErrorType.Authorization
    } else if (statusCode === 404) {
      type = TextToPdfErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TextToPdfErrorType.Validation
    } else if (statusCode === 429) {
      type = TextToPdfErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TextToPdfErrorType.Server
      retryable = true
    }

    return new TextToPdfError(message, code, type, {
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
    return this.type === TextToPdfErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TextToPdfErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TextToPdfErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TextToPdfErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TextToPdfErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TextToPdfErrorType.Server
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

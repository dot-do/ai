/**
 * Langbase Errors
 *
 * Auto-generated error handling for Langbase Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/langbase
 */

/**
 * Error type enum
 */
export enum LangbaseErrorType {
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
 * Langbase Error class
 *
 * Custom error class for Langbase Integration operations.
 */
export class LangbaseError extends Error {
  public readonly code: string | number
  public readonly type: LangbaseErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LangbaseErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LangbaseError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LangbaseError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LangbaseError instance
   */
  static fromError(error: any): LangbaseError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LangbaseErrorType; retryable: boolean }> = {
      '401': { type: LangbaseErrorType.Authentication, retryable: false },
      '429': { type: LangbaseErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LangbaseError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LangbaseErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LangbaseErrorType.Authentication
    } else if (statusCode === 403) {
      type = LangbaseErrorType.Authorization
    } else if (statusCode === 404) {
      type = LangbaseErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LangbaseErrorType.Validation
    } else if (statusCode === 429) {
      type = LangbaseErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LangbaseErrorType.Server
      retryable = true
    }

    return new LangbaseError(message, code, type, {
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
    return this.type === LangbaseErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LangbaseErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LangbaseErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LangbaseErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LangbaseErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LangbaseErrorType.Server
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

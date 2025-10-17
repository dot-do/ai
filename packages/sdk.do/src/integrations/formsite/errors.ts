/**
 * Formsite Errors
 *
 * Auto-generated error handling for Formsite Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/formsite
 */

/**
 * Error type enum
 */
export enum FormsiteErrorType {
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
 * Formsite Error class
 *
 * Custom error class for Formsite Integration operations.
 */
export class FormsiteError extends Error {
  public readonly code: string | number
  public readonly type: FormsiteErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FormsiteErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FormsiteError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FormsiteError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FormsiteError instance
   */
  static fromError(error: any): FormsiteError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FormsiteErrorType; retryable: boolean }> = {
      '401': { type: FormsiteErrorType.Authentication, retryable: false },
      '429': { type: FormsiteErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FormsiteError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FormsiteErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FormsiteErrorType.Authentication
    } else if (statusCode === 403) {
      type = FormsiteErrorType.Authorization
    } else if (statusCode === 404) {
      type = FormsiteErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FormsiteErrorType.Validation
    } else if (statusCode === 429) {
      type = FormsiteErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FormsiteErrorType.Server
      retryable = true
    }

    return new FormsiteError(message, code, type, {
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
    return this.type === FormsiteErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FormsiteErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FormsiteErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FormsiteErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FormsiteErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FormsiteErrorType.Server
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

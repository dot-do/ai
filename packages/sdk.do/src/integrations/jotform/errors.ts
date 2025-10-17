/**
 * Jotform Errors
 *
 * Auto-generated error handling for Jotform Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/jotform
 */

/**
 * Error type enum
 */
export enum JotformErrorType {
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
 * Jotform Error class
 *
 * Custom error class for Jotform Integration operations.
 */
export class JotformError extends Error {
  public readonly code: string | number
  public readonly type: JotformErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: JotformErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'JotformError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, JotformError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns JotformError instance
   */
  static fromError(error: any): JotformError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: JotformErrorType; retryable: boolean }> = {
      '401': { type: JotformErrorType.Authentication, retryable: false },
      '429': { type: JotformErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new JotformError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = JotformErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = JotformErrorType.Authentication
    } else if (statusCode === 403) {
      type = JotformErrorType.Authorization
    } else if (statusCode === 404) {
      type = JotformErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = JotformErrorType.Validation
    } else if (statusCode === 429) {
      type = JotformErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = JotformErrorType.Server
      retryable = true
    }

    return new JotformError(message, code, type, {
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
    return this.type === JotformErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === JotformErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === JotformErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === JotformErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === JotformErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === JotformErrorType.Server
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

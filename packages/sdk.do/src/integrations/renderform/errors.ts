/**
 * Renderform Errors
 *
 * Auto-generated error handling for Renderform Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/renderform
 */

/**
 * Error type enum
 */
export enum RenderformErrorType {
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
 * Renderform Error class
 *
 * Custom error class for Renderform Integration operations.
 */
export class RenderformError extends Error {
  public readonly code: string | number
  public readonly type: RenderformErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RenderformErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RenderformError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RenderformError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RenderformError instance
   */
  static fromError(error: any): RenderformError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RenderformErrorType; retryable: boolean }> = {
      '401': { type: RenderformErrorType.Authentication, retryable: false },
      '429': { type: RenderformErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RenderformError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RenderformErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RenderformErrorType.Authentication
    } else if (statusCode === 403) {
      type = RenderformErrorType.Authorization
    } else if (statusCode === 404) {
      type = RenderformErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RenderformErrorType.Validation
    } else if (statusCode === 429) {
      type = RenderformErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RenderformErrorType.Server
      retryable = true
    }

    return new RenderformError(message, code, type, {
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
    return this.type === RenderformErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RenderformErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RenderformErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RenderformErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RenderformErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RenderformErrorType.Server
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

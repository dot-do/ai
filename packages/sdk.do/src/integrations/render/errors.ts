/**
 * Render Errors
 *
 * Auto-generated error handling for Render Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/render
 */

/**
 * Error type enum
 */
export enum RenderErrorType {
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
 * Render Error class
 *
 * Custom error class for Render Integration operations.
 */
export class RenderError extends Error {
  public readonly code: string | number
  public readonly type: RenderErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RenderErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RenderError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RenderError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RenderError instance
   */
  static fromError(error: any): RenderError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RenderErrorType; retryable: boolean }> = {
      '401': { type: RenderErrorType.Authentication, retryable: false },
      '429': { type: RenderErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RenderError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RenderErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RenderErrorType.Authentication
    } else if (statusCode === 403) {
      type = RenderErrorType.Authorization
    } else if (statusCode === 404) {
      type = RenderErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RenderErrorType.Validation
    } else if (statusCode === 429) {
      type = RenderErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RenderErrorType.Server
      retryable = true
    }

    return new RenderError(message, code, type, {
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
    return this.type === RenderErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RenderErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RenderErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RenderErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RenderErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RenderErrorType.Server
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

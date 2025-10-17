/**
 * Composio Errors
 *
 * Auto-generated error handling for Composio Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/composio
 */

/**
 * Error type enum
 */
export enum ComposioErrorType {
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
 * Composio Error class
 *
 * Custom error class for Composio Integration operations.
 */
export class ComposioError extends Error {
  public readonly code: string | number
  public readonly type: ComposioErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ComposioErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ComposioError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ComposioError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ComposioError instance
   */
  static fromError(error: any): ComposioError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ComposioErrorType; retryable: boolean }> = {
      '401': { type: ComposioErrorType.Authentication, retryable: false },
      '429': { type: ComposioErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ComposioError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ComposioErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ComposioErrorType.Authentication
    } else if (statusCode === 403) {
      type = ComposioErrorType.Authorization
    } else if (statusCode === 404) {
      type = ComposioErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ComposioErrorType.Validation
    } else if (statusCode === 429) {
      type = ComposioErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ComposioErrorType.Server
      retryable = true
    }

    return new ComposioError(message, code, type, {
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
    return this.type === ComposioErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ComposioErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ComposioErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ComposioErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ComposioErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ComposioErrorType.Server
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

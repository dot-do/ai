/**
 * Launch darkly Errors
 *
 * Auto-generated error handling for Launch darkly Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/launch_darkly
 */

/**
 * Error type enum
 */
export enum LaunchDarklyErrorType {
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
 * Launch darkly Error class
 *
 * Custom error class for Launch darkly Integration operations.
 */
export class LaunchDarklyError extends Error {
  public readonly code: string | number
  public readonly type: LaunchDarklyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LaunchDarklyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LaunchDarklyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LaunchDarklyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LaunchDarklyError instance
   */
  static fromError(error: any): LaunchDarklyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LaunchDarklyErrorType; retryable: boolean }> = {
      '401': { type: LaunchDarklyErrorType.Authentication, retryable: false },
      '429': { type: LaunchDarklyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LaunchDarklyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LaunchDarklyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LaunchDarklyErrorType.Authentication
    } else if (statusCode === 403) {
      type = LaunchDarklyErrorType.Authorization
    } else if (statusCode === 404) {
      type = LaunchDarklyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LaunchDarklyErrorType.Validation
    } else if (statusCode === 429) {
      type = LaunchDarklyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LaunchDarklyErrorType.Server
      retryable = true
    }

    return new LaunchDarklyError(message, code, type, {
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
    return this.type === LaunchDarklyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LaunchDarklyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LaunchDarklyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LaunchDarklyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LaunchDarklyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LaunchDarklyErrorType.Server
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

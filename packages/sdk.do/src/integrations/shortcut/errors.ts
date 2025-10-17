/**
 * Shortcut Errors
 *
 * Auto-generated error handling for Shortcut Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/shortcut
 */

/**
 * Error type enum
 */
export enum ShortcutErrorType {
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
 * Shortcut Error class
 *
 * Custom error class for Shortcut Integration operations.
 */
export class ShortcutError extends Error {
  public readonly code: string | number
  public readonly type: ShortcutErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ShortcutErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ShortcutError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ShortcutError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ShortcutError instance
   */
  static fromError(error: any): ShortcutError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ShortcutErrorType; retryable: boolean }> = {
      '401': { type: ShortcutErrorType.Authentication, retryable: false },
      '429': { type: ShortcutErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ShortcutError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ShortcutErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ShortcutErrorType.Authentication
    } else if (statusCode === 403) {
      type = ShortcutErrorType.Authorization
    } else if (statusCode === 404) {
      type = ShortcutErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ShortcutErrorType.Validation
    } else if (statusCode === 429) {
      type = ShortcutErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ShortcutErrorType.Server
      retryable = true
    }

    return new ShortcutError(message, code, type, {
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
    return this.type === ShortcutErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ShortcutErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ShortcutErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ShortcutErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ShortcutErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ShortcutErrorType.Server
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

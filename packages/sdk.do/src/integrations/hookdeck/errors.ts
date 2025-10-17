/**
 * Hookdeck Errors
 *
 * Auto-generated error handling for Hookdeck Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/hookdeck
 */

/**
 * Error type enum
 */
export enum HookdeckErrorType {
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
 * Hookdeck Error class
 *
 * Custom error class for Hookdeck Integration operations.
 */
export class HookdeckError extends Error {
  public readonly code: string | number
  public readonly type: HookdeckErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: HookdeckErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'HookdeckError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HookdeckError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns HookdeckError instance
   */
  static fromError(error: any): HookdeckError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: HookdeckErrorType; retryable: boolean }> = {
      '401': { type: HookdeckErrorType.Authentication, retryable: false },
      '429': { type: HookdeckErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new HookdeckError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = HookdeckErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = HookdeckErrorType.Authentication
    } else if (statusCode === 403) {
      type = HookdeckErrorType.Authorization
    } else if (statusCode === 404) {
      type = HookdeckErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = HookdeckErrorType.Validation
    } else if (statusCode === 429) {
      type = HookdeckErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = HookdeckErrorType.Server
      retryable = true
    }

    return new HookdeckError(message, code, type, {
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
    return this.type === HookdeckErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === HookdeckErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === HookdeckErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === HookdeckErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === HookdeckErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === HookdeckErrorType.Server
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

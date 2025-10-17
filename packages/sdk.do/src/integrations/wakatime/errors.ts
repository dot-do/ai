/**
 * Wakatime Errors
 *
 * Auto-generated error handling for Wakatime Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/wakatime
 */

/**
 * Error type enum
 */
export enum WakatimeErrorType {
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
 * Wakatime Error class
 *
 * Custom error class for Wakatime Integration operations.
 */
export class WakatimeError extends Error {
  public readonly code: string | number
  public readonly type: WakatimeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WakatimeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WakatimeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WakatimeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WakatimeError instance
   */
  static fromError(error: any): WakatimeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WakatimeErrorType; retryable: boolean }> = {
      '401': { type: WakatimeErrorType.Authentication, retryable: false },
      '429': { type: WakatimeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WakatimeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WakatimeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WakatimeErrorType.Authentication
    } else if (statusCode === 403) {
      type = WakatimeErrorType.Authorization
    } else if (statusCode === 404) {
      type = WakatimeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WakatimeErrorType.Validation
    } else if (statusCode === 429) {
      type = WakatimeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WakatimeErrorType.Server
      retryable = true
    }

    return new WakatimeError(message, code, type, {
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
    return this.type === WakatimeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WakatimeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WakatimeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WakatimeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WakatimeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WakatimeErrorType.Server
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

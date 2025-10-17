/**
 * Wrike Errors
 *
 * Auto-generated error handling for Wrike Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/wrike
 */

/**
 * Error type enum
 */
export enum WrikeErrorType {
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
 * Wrike Error class
 *
 * Custom error class for Wrike Integration operations.
 */
export class WrikeError extends Error {
  public readonly code: string | number
  public readonly type: WrikeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WrikeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WrikeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WrikeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WrikeError instance
   */
  static fromError(error: any): WrikeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WrikeErrorType; retryable: boolean }> = {
      '401': { type: WrikeErrorType.Authentication, retryable: false },
      '429': { type: WrikeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WrikeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WrikeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WrikeErrorType.Authentication
    } else if (statusCode === 403) {
      type = WrikeErrorType.Authorization
    } else if (statusCode === 404) {
      type = WrikeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WrikeErrorType.Validation
    } else if (statusCode === 429) {
      type = WrikeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WrikeErrorType.Server
      retryable = true
    }

    return new WrikeError(message, code, type, {
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
    return this.type === WrikeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WrikeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WrikeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WrikeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WrikeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WrikeErrorType.Server
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

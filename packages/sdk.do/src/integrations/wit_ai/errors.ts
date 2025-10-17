/**
 * Wit ai Errors
 *
 * Auto-generated error handling for Wit ai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/wit_ai
 */

/**
 * Error type enum
 */
export enum WitAiErrorType {
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
 * Wit ai Error class
 *
 * Custom error class for Wit ai Integration operations.
 */
export class WitAiError extends Error {
  public readonly code: string | number
  public readonly type: WitAiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WitAiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WitAiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WitAiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WitAiError instance
   */
  static fromError(error: any): WitAiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WitAiErrorType; retryable: boolean }> = {
      '401': { type: WitAiErrorType.Authentication, retryable: false },
      '429': { type: WitAiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WitAiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WitAiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WitAiErrorType.Authentication
    } else if (statusCode === 403) {
      type = WitAiErrorType.Authorization
    } else if (statusCode === 404) {
      type = WitAiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WitAiErrorType.Validation
    } else if (statusCode === 429) {
      type = WitAiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WitAiErrorType.Server
      retryable = true
    }

    return new WitAiError(message, code, type, {
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
    return this.type === WitAiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WitAiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WitAiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WitAiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WitAiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WitAiErrorType.Server
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

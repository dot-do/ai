/**
 * Winston ai Errors
 *
 * Auto-generated error handling for Winston ai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/winston_ai
 */

/**
 * Error type enum
 */
export enum WinstonAiErrorType {
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
 * Winston ai Error class
 *
 * Custom error class for Winston ai Integration operations.
 */
export class WinstonAiError extends Error {
  public readonly code: string | number
  public readonly type: WinstonAiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WinstonAiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WinstonAiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WinstonAiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WinstonAiError instance
   */
  static fromError(error: any): WinstonAiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WinstonAiErrorType; retryable: boolean }> = {
      '401': { type: WinstonAiErrorType.Authentication, retryable: false },
      '429': { type: WinstonAiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WinstonAiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WinstonAiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WinstonAiErrorType.Authentication
    } else if (statusCode === 403) {
      type = WinstonAiErrorType.Authorization
    } else if (statusCode === 404) {
      type = WinstonAiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WinstonAiErrorType.Validation
    } else if (statusCode === 429) {
      type = WinstonAiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WinstonAiErrorType.Server
      retryable = true
    }

    return new WinstonAiError(message, code, type, {
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
    return this.type === WinstonAiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WinstonAiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WinstonAiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WinstonAiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WinstonAiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WinstonAiErrorType.Server
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

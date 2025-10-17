/**
 * Fidel api Errors
 *
 * Auto-generated error handling for Fidel api Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/fidel_api
 */

/**
 * Error type enum
 */
export enum FidelApiErrorType {
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
 * Fidel api Error class
 *
 * Custom error class for Fidel api Integration operations.
 */
export class FidelApiError extends Error {
  public readonly code: string | number
  public readonly type: FidelApiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FidelApiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FidelApiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FidelApiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FidelApiError instance
   */
  static fromError(error: any): FidelApiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FidelApiErrorType; retryable: boolean }> = {
      '401': { type: FidelApiErrorType.Authentication, retryable: false },
      '429': { type: FidelApiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FidelApiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FidelApiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FidelApiErrorType.Authentication
    } else if (statusCode === 403) {
      type = FidelApiErrorType.Authorization
    } else if (statusCode === 404) {
      type = FidelApiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FidelApiErrorType.Validation
    } else if (statusCode === 429) {
      type = FidelApiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FidelApiErrorType.Server
      retryable = true
    }

    return new FidelApiError(message, code, type, {
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
    return this.type === FidelApiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FidelApiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FidelApiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FidelApiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FidelApiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FidelApiErrorType.Server
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

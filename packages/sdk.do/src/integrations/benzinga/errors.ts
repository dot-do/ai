/**
 * Benzinga Errors
 *
 * Auto-generated error handling for Benzinga Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/benzinga
 */

/**
 * Error type enum
 */
export enum BenzingaErrorType {
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
 * Benzinga Error class
 *
 * Custom error class for Benzinga Integration operations.
 */
export class BenzingaError extends Error {
  public readonly code: string | number
  public readonly type: BenzingaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BenzingaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BenzingaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BenzingaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BenzingaError instance
   */
  static fromError(error: any): BenzingaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BenzingaErrorType; retryable: boolean }> = {
      '401': { type: BenzingaErrorType.Authentication, retryable: false },
      '429': { type: BenzingaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BenzingaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BenzingaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BenzingaErrorType.Authentication
    } else if (statusCode === 403) {
      type = BenzingaErrorType.Authorization
    } else if (statusCode === 404) {
      type = BenzingaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BenzingaErrorType.Validation
    } else if (statusCode === 429) {
      type = BenzingaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BenzingaErrorType.Server
      retryable = true
    }

    return new BenzingaError(message, code, type, {
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
    return this.type === BenzingaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BenzingaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BenzingaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BenzingaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BenzingaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BenzingaErrorType.Server
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

/**
 * Token metrics Errors
 *
 * Auto-generated error handling for Token metrics Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/token_metrics
 */

/**
 * Error type enum
 */
export enum TokenMetricsErrorType {
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
 * Token metrics Error class
 *
 * Custom error class for Token metrics Integration operations.
 */
export class TokenMetricsError extends Error {
  public readonly code: string | number
  public readonly type: TokenMetricsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TokenMetricsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TokenMetricsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TokenMetricsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TokenMetricsError instance
   */
  static fromError(error: any): TokenMetricsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TokenMetricsErrorType; retryable: boolean }> = {
      '401': { type: TokenMetricsErrorType.Authentication, retryable: false },
      '429': { type: TokenMetricsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TokenMetricsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TokenMetricsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TokenMetricsErrorType.Authentication
    } else if (statusCode === 403) {
      type = TokenMetricsErrorType.Authorization
    } else if (statusCode === 404) {
      type = TokenMetricsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TokenMetricsErrorType.Validation
    } else if (statusCode === 429) {
      type = TokenMetricsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TokenMetricsErrorType.Server
      retryable = true
    }

    return new TokenMetricsError(message, code, type, {
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
    return this.type === TokenMetricsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TokenMetricsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TokenMetricsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TokenMetricsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TokenMetricsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TokenMetricsErrorType.Server
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

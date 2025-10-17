/**
 * Plaid Errors
 *
 * Auto-generated error handling for Plaid Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/plaid
 */

/**
 * Error type enum
 */
export enum PlaidErrorType {
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
 * Plaid Error class
 *
 * Custom error class for Plaid Integration operations.
 */
export class PlaidError extends Error {
  public readonly code: string | number
  public readonly type: PlaidErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PlaidErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PlaidError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PlaidError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PlaidError instance
   */
  static fromError(error: any): PlaidError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PlaidErrorType; retryable: boolean }> = {
      INVALID_API_KEYS: { type: PlaidErrorType.Authentication, retryable: false },
      UNAUTHORIZED_ENVIRONMENT: { type: PlaidErrorType.Authorization, retryable: false },
      ITEM_NOT_FOUND: { type: PlaidErrorType.NotFound, retryable: false },
      INVALID_REQUEST: { type: PlaidErrorType.Validation, retryable: false },
      RATE_LIMIT_EXCEEDED: { type: PlaidErrorType.RateLimit, retryable: true },
      INTERNAL_SERVER_ERROR: { type: PlaidErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PlaidError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PlaidErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PlaidErrorType.Authentication
    } else if (statusCode === 403) {
      type = PlaidErrorType.Authorization
    } else if (statusCode === 404) {
      type = PlaidErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PlaidErrorType.Validation
    } else if (statusCode === 429) {
      type = PlaidErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PlaidErrorType.Server
      retryable = true
    }

    return new PlaidError(message, code, type, {
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
    return this.type === PlaidErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PlaidErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PlaidErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PlaidErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PlaidErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PlaidErrorType.Server
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

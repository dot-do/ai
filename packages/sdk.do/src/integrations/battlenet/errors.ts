/**
 * Battlenet Errors
 *
 * Auto-generated error handling for Battlenet Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/battlenet
 */

/**
 * Error type enum
 */
export enum BattlenetErrorType {
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
 * Battlenet Error class
 *
 * Custom error class for Battlenet Integration operations.
 */
export class BattlenetError extends Error {
  public readonly code: string | number
  public readonly type: BattlenetErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BattlenetErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BattlenetError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BattlenetError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BattlenetError instance
   */
  static fromError(error: any): BattlenetError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BattlenetErrorType; retryable: boolean }> = {
      '401': { type: BattlenetErrorType.Authentication, retryable: false },
      '429': { type: BattlenetErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BattlenetError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BattlenetErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BattlenetErrorType.Authentication
    } else if (statusCode === 403) {
      type = BattlenetErrorType.Authorization
    } else if (statusCode === 404) {
      type = BattlenetErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BattlenetErrorType.Validation
    } else if (statusCode === 429) {
      type = BattlenetErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BattlenetErrorType.Server
      retryable = true
    }

    return new BattlenetError(message, code, type, {
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
    return this.type === BattlenetErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BattlenetErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BattlenetErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BattlenetErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BattlenetErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BattlenetErrorType.Server
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

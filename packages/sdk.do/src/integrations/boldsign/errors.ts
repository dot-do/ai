/**
 * Boldsign Errors
 *
 * Auto-generated error handling for Boldsign Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/boldsign
 */

/**
 * Error type enum
 */
export enum BoldsignErrorType {
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
 * Boldsign Error class
 *
 * Custom error class for Boldsign Integration operations.
 */
export class BoldsignError extends Error {
  public readonly code: string | number
  public readonly type: BoldsignErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BoldsignErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BoldsignError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BoldsignError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BoldsignError instance
   */
  static fromError(error: any): BoldsignError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BoldsignErrorType; retryable: boolean }> = {
      '401': { type: BoldsignErrorType.Authentication, retryable: false },
      '429': { type: BoldsignErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BoldsignError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BoldsignErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BoldsignErrorType.Authentication
    } else if (statusCode === 403) {
      type = BoldsignErrorType.Authorization
    } else if (statusCode === 404) {
      type = BoldsignErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BoldsignErrorType.Validation
    } else if (statusCode === 429) {
      type = BoldsignErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BoldsignErrorType.Server
      retryable = true
    }

    return new BoldsignError(message, code, type, {
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
    return this.type === BoldsignErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BoldsignErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BoldsignErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BoldsignErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BoldsignErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BoldsignErrorType.Server
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

/**
 * Bamboohr Errors
 *
 * Auto-generated error handling for Bamboohr Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bamboohr
 */

/**
 * Error type enum
 */
export enum BamboohrErrorType {
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
 * Bamboohr Error class
 *
 * Custom error class for Bamboohr Integration operations.
 */
export class BamboohrError extends Error {
  public readonly code: string | number
  public readonly type: BamboohrErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BamboohrErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BamboohrError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BamboohrError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BamboohrError instance
   */
  static fromError(error: any): BamboohrError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BamboohrErrorType; retryable: boolean }> = {
      '401': { type: BamboohrErrorType.Authentication, retryable: false },
      '429': { type: BamboohrErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BamboohrError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BamboohrErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BamboohrErrorType.Authentication
    } else if (statusCode === 403) {
      type = BamboohrErrorType.Authorization
    } else if (statusCode === 404) {
      type = BamboohrErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BamboohrErrorType.Validation
    } else if (statusCode === 429) {
      type = BamboohrErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BamboohrErrorType.Server
      retryable = true
    }

    return new BamboohrError(message, code, type, {
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
    return this.type === BamboohrErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BamboohrErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BamboohrErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BamboohrErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BamboohrErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BamboohrErrorType.Server
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

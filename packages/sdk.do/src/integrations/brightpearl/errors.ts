/**
 * Brightpearl Errors
 *
 * Auto-generated error handling for Brightpearl Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/brightpearl
 */

/**
 * Error type enum
 */
export enum BrightpearlErrorType {
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
 * Brightpearl Error class
 *
 * Custom error class for Brightpearl Integration operations.
 */
export class BrightpearlError extends Error {
  public readonly code: string | number
  public readonly type: BrightpearlErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BrightpearlErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BrightpearlError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BrightpearlError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BrightpearlError instance
   */
  static fromError(error: any): BrightpearlError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BrightpearlErrorType; retryable: boolean }> = {
      '401': { type: BrightpearlErrorType.Authentication, retryable: false },
      '429': { type: BrightpearlErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BrightpearlError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BrightpearlErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BrightpearlErrorType.Authentication
    } else if (statusCode === 403) {
      type = BrightpearlErrorType.Authorization
    } else if (statusCode === 404) {
      type = BrightpearlErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BrightpearlErrorType.Validation
    } else if (statusCode === 429) {
      type = BrightpearlErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BrightpearlErrorType.Server
      retryable = true
    }

    return new BrightpearlError(message, code, type, {
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
    return this.type === BrightpearlErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BrightpearlErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BrightpearlErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BrightpearlErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BrightpearlErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BrightpearlErrorType.Server
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

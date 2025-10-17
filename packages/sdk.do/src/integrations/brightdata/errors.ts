/**
 * Brightdata Errors
 *
 * Auto-generated error handling for Brightdata Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/brightdata
 */

/**
 * Error type enum
 */
export enum BrightdataErrorType {
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
 * Brightdata Error class
 *
 * Custom error class for Brightdata Integration operations.
 */
export class BrightdataError extends Error {
  public readonly code: string | number
  public readonly type: BrightdataErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BrightdataErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BrightdataError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BrightdataError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BrightdataError instance
   */
  static fromError(error: any): BrightdataError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BrightdataErrorType; retryable: boolean }> = {
      '401': { type: BrightdataErrorType.Authentication, retryable: false },
      '429': { type: BrightdataErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BrightdataError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BrightdataErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BrightdataErrorType.Authentication
    } else if (statusCode === 403) {
      type = BrightdataErrorType.Authorization
    } else if (statusCode === 404) {
      type = BrightdataErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BrightdataErrorType.Validation
    } else if (statusCode === 429) {
      type = BrightdataErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BrightdataErrorType.Server
      retryable = true
    }

    return new BrightdataError(message, code, type, {
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
    return this.type === BrightdataErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BrightdataErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BrightdataErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BrightdataErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BrightdataErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BrightdataErrorType.Server
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

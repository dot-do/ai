/**
 * Curated Errors
 *
 * Auto-generated error handling for Curated Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/curated
 */

/**
 * Error type enum
 */
export enum CuratedErrorType {
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
 * Curated Error class
 *
 * Custom error class for Curated Integration operations.
 */
export class CuratedError extends Error {
  public readonly code: string | number
  public readonly type: CuratedErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CuratedErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CuratedError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CuratedError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CuratedError instance
   */
  static fromError(error: any): CuratedError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CuratedErrorType; retryable: boolean }> = {
      '401': { type: CuratedErrorType.Authentication, retryable: false },
      '429': { type: CuratedErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CuratedError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CuratedErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CuratedErrorType.Authentication
    } else if (statusCode === 403) {
      type = CuratedErrorType.Authorization
    } else if (statusCode === 404) {
      type = CuratedErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CuratedErrorType.Validation
    } else if (statusCode === 429) {
      type = CuratedErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CuratedErrorType.Server
      retryable = true
    }

    return new CuratedError(message, code, type, {
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
    return this.type === CuratedErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CuratedErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CuratedErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CuratedErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CuratedErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CuratedErrorType.Server
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

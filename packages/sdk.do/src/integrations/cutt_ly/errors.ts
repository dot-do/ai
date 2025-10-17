/**
 * Cutt ly Errors
 *
 * Auto-generated error handling for Cutt ly Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/cutt_ly
 */

/**
 * Error type enum
 */
export enum CuttLyErrorType {
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
 * Cutt ly Error class
 *
 * Custom error class for Cutt ly Integration operations.
 */
export class CuttLyError extends Error {
  public readonly code: string | number
  public readonly type: CuttLyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CuttLyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CuttLyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CuttLyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CuttLyError instance
   */
  static fromError(error: any): CuttLyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CuttLyErrorType; retryable: boolean }> = {
      '401': { type: CuttLyErrorType.Authentication, retryable: false },
      '429': { type: CuttLyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CuttLyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CuttLyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CuttLyErrorType.Authentication
    } else if (statusCode === 403) {
      type = CuttLyErrorType.Authorization
    } else if (statusCode === 404) {
      type = CuttLyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CuttLyErrorType.Validation
    } else if (statusCode === 429) {
      type = CuttLyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CuttLyErrorType.Server
      retryable = true
    }

    return new CuttLyError(message, code, type, {
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
    return this.type === CuttLyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CuttLyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CuttLyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CuttLyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CuttLyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CuttLyErrorType.Server
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

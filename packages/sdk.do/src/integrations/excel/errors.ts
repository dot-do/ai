/**
 * Excel Errors
 *
 * Auto-generated error handling for Excel Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/excel
 */

/**
 * Error type enum
 */
export enum ExcelErrorType {
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
 * Excel Error class
 *
 * Custom error class for Excel Integration operations.
 */
export class ExcelError extends Error {
  public readonly code: string | number
  public readonly type: ExcelErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ExcelErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ExcelError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ExcelError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ExcelError instance
   */
  static fromError(error: any): ExcelError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ExcelErrorType; retryable: boolean }> = {
      '401': { type: ExcelErrorType.Authentication, retryable: false },
      '429': { type: ExcelErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ExcelError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ExcelErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ExcelErrorType.Authentication
    } else if (statusCode === 403) {
      type = ExcelErrorType.Authorization
    } else if (statusCode === 404) {
      type = ExcelErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ExcelErrorType.Validation
    } else if (statusCode === 429) {
      type = ExcelErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ExcelErrorType.Server
      retryable = true
    }

    return new ExcelError(message, code, type, {
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
    return this.type === ExcelErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ExcelErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ExcelErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ExcelErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ExcelErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ExcelErrorType.Server
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

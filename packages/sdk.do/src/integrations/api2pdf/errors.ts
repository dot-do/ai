/**
 * Api2pdf Errors
 *
 * Auto-generated error handling for Api2pdf Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/api2pdf
 */

/**
 * Error type enum
 */
export enum Api2pdfErrorType {
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
 * Api2pdf Error class
 *
 * Custom error class for Api2pdf Integration operations.
 */
export class Api2pdfError extends Error {
  public readonly code: string | number
  public readonly type: Api2pdfErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: Api2pdfErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'Api2pdfError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Api2pdfError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns Api2pdfError instance
   */
  static fromError(error: any): Api2pdfError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: Api2pdfErrorType; retryable: boolean }> = {
      '401': { type: Api2pdfErrorType.Authentication, retryable: false },
      '429': { type: Api2pdfErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new Api2pdfError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = Api2pdfErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = Api2pdfErrorType.Authentication
    } else if (statusCode === 403) {
      type = Api2pdfErrorType.Authorization
    } else if (statusCode === 404) {
      type = Api2pdfErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = Api2pdfErrorType.Validation
    } else if (statusCode === 429) {
      type = Api2pdfErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = Api2pdfErrorType.Server
      retryable = true
    }

    return new Api2pdfError(message, code, type, {
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
    return this.type === Api2pdfErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === Api2pdfErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === Api2pdfErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === Api2pdfErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === Api2pdfErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === Api2pdfErrorType.Server
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

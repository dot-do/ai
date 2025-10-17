/**
 * Pdf co Errors
 *
 * Auto-generated error handling for Pdf co Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/pdf_co
 */

/**
 * Error type enum
 */
export enum PdfCoErrorType {
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
 * Pdf co Error class
 *
 * Custom error class for Pdf co Integration operations.
 */
export class PdfCoError extends Error {
  public readonly code: string | number
  public readonly type: PdfCoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PdfCoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PdfCoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PdfCoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PdfCoError instance
   */
  static fromError(error: any): PdfCoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PdfCoErrorType; retryable: boolean }> = {
      '401': { type: PdfCoErrorType.Authentication, retryable: false },
      '429': { type: PdfCoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PdfCoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PdfCoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PdfCoErrorType.Authentication
    } else if (statusCode === 403) {
      type = PdfCoErrorType.Authorization
    } else if (statusCode === 404) {
      type = PdfCoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PdfCoErrorType.Validation
    } else if (statusCode === 429) {
      type = PdfCoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PdfCoErrorType.Server
      retryable = true
    }

    return new PdfCoError(message, code, type, {
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
    return this.type === PdfCoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PdfCoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PdfCoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PdfCoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PdfCoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PdfCoErrorType.Server
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

/**
 * Pdf api io Errors
 *
 * Auto-generated error handling for Pdf api io Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/pdf_api_io
 */

/**
 * Error type enum
 */
export enum PdfApiIoErrorType {
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
 * Pdf api io Error class
 *
 * Custom error class for Pdf api io Integration operations.
 */
export class PdfApiIoError extends Error {
  public readonly code: string | number
  public readonly type: PdfApiIoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PdfApiIoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PdfApiIoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PdfApiIoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PdfApiIoError instance
   */
  static fromError(error: any): PdfApiIoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PdfApiIoErrorType; retryable: boolean }> = {
      '401': { type: PdfApiIoErrorType.Authentication, retryable: false },
      '429': { type: PdfApiIoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PdfApiIoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PdfApiIoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PdfApiIoErrorType.Authentication
    } else if (statusCode === 403) {
      type = PdfApiIoErrorType.Authorization
    } else if (statusCode === 404) {
      type = PdfApiIoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PdfApiIoErrorType.Validation
    } else if (statusCode === 429) {
      type = PdfApiIoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PdfApiIoErrorType.Server
      retryable = true
    }

    return new PdfApiIoError(message, code, type, {
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
    return this.type === PdfApiIoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PdfApiIoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PdfApiIoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PdfApiIoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PdfApiIoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PdfApiIoErrorType.Server
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

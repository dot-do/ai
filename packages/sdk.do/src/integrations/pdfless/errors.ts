/**
 * Pdfless Errors
 *
 * Auto-generated error handling for Pdfless Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/pdfless
 */

/**
 * Error type enum
 */
export enum PdflessErrorType {
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
 * Pdfless Error class
 *
 * Custom error class for Pdfless Integration operations.
 */
export class PdflessError extends Error {
  public readonly code: string | number
  public readonly type: PdflessErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PdflessErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PdflessError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PdflessError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PdflessError instance
   */
  static fromError(error: any): PdflessError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PdflessErrorType; retryable: boolean }> = {
      '401': { type: PdflessErrorType.Authentication, retryable: false },
      '429': { type: PdflessErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PdflessError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PdflessErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PdflessErrorType.Authentication
    } else if (statusCode === 403) {
      type = PdflessErrorType.Authorization
    } else if (statusCode === 404) {
      type = PdflessErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PdflessErrorType.Validation
    } else if (statusCode === 429) {
      type = PdflessErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PdflessErrorType.Server
      retryable = true
    }

    return new PdflessError(message, code, type, {
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
    return this.type === PdflessErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PdflessErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PdflessErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PdflessErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PdflessErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PdflessErrorType.Server
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

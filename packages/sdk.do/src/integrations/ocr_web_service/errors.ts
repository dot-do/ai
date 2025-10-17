/**
 * Ocr web service Errors
 *
 * Auto-generated error handling for Ocr web service Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ocr_web_service
 */

/**
 * Error type enum
 */
export enum OcrWebServiceErrorType {
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
 * Ocr web service Error class
 *
 * Custom error class for Ocr web service Integration operations.
 */
export class OcrWebServiceError extends Error {
  public readonly code: string | number
  public readonly type: OcrWebServiceErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: OcrWebServiceErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'OcrWebServiceError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OcrWebServiceError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns OcrWebServiceError instance
   */
  static fromError(error: any): OcrWebServiceError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: OcrWebServiceErrorType; retryable: boolean }> = {
      '401': { type: OcrWebServiceErrorType.Authentication, retryable: false },
      '429': { type: OcrWebServiceErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new OcrWebServiceError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = OcrWebServiceErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = OcrWebServiceErrorType.Authentication
    } else if (statusCode === 403) {
      type = OcrWebServiceErrorType.Authorization
    } else if (statusCode === 404) {
      type = OcrWebServiceErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = OcrWebServiceErrorType.Validation
    } else if (statusCode === 429) {
      type = OcrWebServiceErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = OcrWebServiceErrorType.Server
      retryable = true
    }

    return new OcrWebServiceError(message, code, type, {
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
    return this.type === OcrWebServiceErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === OcrWebServiceErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === OcrWebServiceErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === OcrWebServiceErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === OcrWebServiceErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === OcrWebServiceErrorType.Server
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

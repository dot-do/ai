/**
 * Ocrspace Errors
 *
 * Auto-generated error handling for Ocrspace Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ocrspace
 */

/**
 * Error type enum
 */
export enum OcrspaceErrorType {
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
 * Ocrspace Error class
 *
 * Custom error class for Ocrspace Integration operations.
 */
export class OcrspaceError extends Error {
  public readonly code: string | number
  public readonly type: OcrspaceErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: OcrspaceErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'OcrspaceError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OcrspaceError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns OcrspaceError instance
   */
  static fromError(error: any): OcrspaceError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: OcrspaceErrorType; retryable: boolean }> = {
      '401': { type: OcrspaceErrorType.Authentication, retryable: false },
      '429': { type: OcrspaceErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new OcrspaceError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = OcrspaceErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = OcrspaceErrorType.Authentication
    } else if (statusCode === 403) {
      type = OcrspaceErrorType.Authorization
    } else if (statusCode === 404) {
      type = OcrspaceErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = OcrspaceErrorType.Validation
    } else if (statusCode === 429) {
      type = OcrspaceErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = OcrspaceErrorType.Server
      retryable = true
    }

    return new OcrspaceError(message, code, type, {
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
    return this.type === OcrspaceErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === OcrspaceErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === OcrspaceErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === OcrspaceErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === OcrspaceErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === OcrspaceErrorType.Server
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

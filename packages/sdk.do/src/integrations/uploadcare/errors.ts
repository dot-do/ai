/**
 * Uploadcare Errors
 *
 * Auto-generated error handling for Uploadcare Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/uploadcare
 */

/**
 * Error type enum
 */
export enum UploadcareErrorType {
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
 * Uploadcare Error class
 *
 * Custom error class for Uploadcare Integration operations.
 */
export class UploadcareError extends Error {
  public readonly code: string | number
  public readonly type: UploadcareErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: UploadcareErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'UploadcareError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UploadcareError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns UploadcareError instance
   */
  static fromError(error: any): UploadcareError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: UploadcareErrorType; retryable: boolean }> = {
      '401': { type: UploadcareErrorType.Authentication, retryable: false },
      '429': { type: UploadcareErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new UploadcareError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = UploadcareErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = UploadcareErrorType.Authentication
    } else if (statusCode === 403) {
      type = UploadcareErrorType.Authorization
    } else if (statusCode === 404) {
      type = UploadcareErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = UploadcareErrorType.Validation
    } else if (statusCode === 429) {
      type = UploadcareErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = UploadcareErrorType.Server
      retryable = true
    }

    return new UploadcareError(message, code, type, {
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
    return this.type === UploadcareErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === UploadcareErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === UploadcareErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === UploadcareErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === UploadcareErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === UploadcareErrorType.Server
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

/**
 * Asin data api Errors
 *
 * Auto-generated error handling for Asin data api Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/asin_data_api
 */

/**
 * Error type enum
 */
export enum AsinDataApiErrorType {
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
 * Asin data api Error class
 *
 * Custom error class for Asin data api Integration operations.
 */
export class AsinDataApiError extends Error {
  public readonly code: string | number
  public readonly type: AsinDataApiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AsinDataApiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AsinDataApiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AsinDataApiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AsinDataApiError instance
   */
  static fromError(error: any): AsinDataApiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AsinDataApiErrorType; retryable: boolean }> = {
      '401': { type: AsinDataApiErrorType.Authentication, retryable: false },
      '429': { type: AsinDataApiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AsinDataApiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AsinDataApiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AsinDataApiErrorType.Authentication
    } else if (statusCode === 403) {
      type = AsinDataApiErrorType.Authorization
    } else if (statusCode === 404) {
      type = AsinDataApiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AsinDataApiErrorType.Validation
    } else if (statusCode === 429) {
      type = AsinDataApiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AsinDataApiErrorType.Server
      retryable = true
    }

    return new AsinDataApiError(message, code, type, {
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
    return this.type === AsinDataApiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AsinDataApiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AsinDataApiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AsinDataApiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AsinDataApiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AsinDataApiErrorType.Server
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

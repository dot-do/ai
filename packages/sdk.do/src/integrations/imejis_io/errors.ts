/**
 * Imejis io Errors
 *
 * Auto-generated error handling for Imejis io Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/imejis_io
 */

/**
 * Error type enum
 */
export enum ImejisIoErrorType {
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
 * Imejis io Error class
 *
 * Custom error class for Imejis io Integration operations.
 */
export class ImejisIoError extends Error {
  public readonly code: string | number
  public readonly type: ImejisIoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ImejisIoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ImejisIoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ImejisIoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ImejisIoError instance
   */
  static fromError(error: any): ImejisIoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ImejisIoErrorType; retryable: boolean }> = {
      '401': { type: ImejisIoErrorType.Authentication, retryable: false },
      '429': { type: ImejisIoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ImejisIoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ImejisIoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ImejisIoErrorType.Authentication
    } else if (statusCode === 403) {
      type = ImejisIoErrorType.Authorization
    } else if (statusCode === 404) {
      type = ImejisIoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ImejisIoErrorType.Validation
    } else if (statusCode === 429) {
      type = ImejisIoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ImejisIoErrorType.Server
      retryable = true
    }

    return new ImejisIoError(message, code, type, {
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
    return this.type === ImejisIoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ImejisIoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ImejisIoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ImejisIoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ImejisIoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ImejisIoErrorType.Server
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

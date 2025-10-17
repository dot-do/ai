/**
 * Byteforms Errors
 *
 * Auto-generated error handling for Byteforms Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/byteforms
 */

/**
 * Error type enum
 */
export enum ByteformsErrorType {
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
 * Byteforms Error class
 *
 * Custom error class for Byteforms Integration operations.
 */
export class ByteformsError extends Error {
  public readonly code: string | number
  public readonly type: ByteformsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ByteformsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ByteformsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ByteformsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ByteformsError instance
   */
  static fromError(error: any): ByteformsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ByteformsErrorType; retryable: boolean }> = {
      '401': { type: ByteformsErrorType.Authentication, retryable: false },
      '429': { type: ByteformsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ByteformsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ByteformsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ByteformsErrorType.Authentication
    } else if (statusCode === 403) {
      type = ByteformsErrorType.Authorization
    } else if (statusCode === 404) {
      type = ByteformsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ByteformsErrorType.Validation
    } else if (statusCode === 429) {
      type = ByteformsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ByteformsErrorType.Server
      retryable = true
    }

    return new ByteformsError(message, code, type, {
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
    return this.type === ByteformsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ByteformsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ByteformsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ByteformsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ByteformsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ByteformsErrorType.Server
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

/**
 * Deepgram Errors
 *
 * Auto-generated error handling for Deepgram Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/deepgram
 */

/**
 * Error type enum
 */
export enum DeepgramErrorType {
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
 * Deepgram Error class
 *
 * Custom error class for Deepgram Integration operations.
 */
export class DeepgramError extends Error {
  public readonly code: string | number
  public readonly type: DeepgramErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DeepgramErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DeepgramError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DeepgramError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DeepgramError instance
   */
  static fromError(error: any): DeepgramError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DeepgramErrorType; retryable: boolean }> = {
      '401': { type: DeepgramErrorType.Authentication, retryable: false },
      '429': { type: DeepgramErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DeepgramError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DeepgramErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DeepgramErrorType.Authentication
    } else if (statusCode === 403) {
      type = DeepgramErrorType.Authorization
    } else if (statusCode === 404) {
      type = DeepgramErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DeepgramErrorType.Validation
    } else if (statusCode === 429) {
      type = DeepgramErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DeepgramErrorType.Server
      retryable = true
    }

    return new DeepgramError(message, code, type, {
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
    return this.type === DeepgramErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DeepgramErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DeepgramErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DeepgramErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DeepgramErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DeepgramErrorType.Server
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

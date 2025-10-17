/**
 * Ragic Errors
 *
 * Auto-generated error handling for Ragic Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ragic
 */

/**
 * Error type enum
 */
export enum RagicErrorType {
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
 * Ragic Error class
 *
 * Custom error class for Ragic Integration operations.
 */
export class RagicError extends Error {
  public readonly code: string | number
  public readonly type: RagicErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RagicErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RagicError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RagicError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RagicError instance
   */
  static fromError(error: any): RagicError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RagicErrorType; retryable: boolean }> = {
      '401': { type: RagicErrorType.Authentication, retryable: false },
      '429': { type: RagicErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RagicError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RagicErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RagicErrorType.Authentication
    } else if (statusCode === 403) {
      type = RagicErrorType.Authorization
    } else if (statusCode === 404) {
      type = RagicErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RagicErrorType.Validation
    } else if (statusCode === 429) {
      type = RagicErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RagicErrorType.Server
      retryable = true
    }

    return new RagicError(message, code, type, {
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
    return this.type === RagicErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RagicErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RagicErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RagicErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RagicErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RagicErrorType.Server
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

/**
 * Linguapop Errors
 *
 * Auto-generated error handling for Linguapop Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/linguapop
 */

/**
 * Error type enum
 */
export enum LinguapopErrorType {
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
 * Linguapop Error class
 *
 * Custom error class for Linguapop Integration operations.
 */
export class LinguapopError extends Error {
  public readonly code: string | number
  public readonly type: LinguapopErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LinguapopErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LinguapopError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LinguapopError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LinguapopError instance
   */
  static fromError(error: any): LinguapopError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LinguapopErrorType; retryable: boolean }> = {
      '401': { type: LinguapopErrorType.Authentication, retryable: false },
      '429': { type: LinguapopErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LinguapopError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LinguapopErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LinguapopErrorType.Authentication
    } else if (statusCode === 403) {
      type = LinguapopErrorType.Authorization
    } else if (statusCode === 404) {
      type = LinguapopErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LinguapopErrorType.Validation
    } else if (statusCode === 429) {
      type = LinguapopErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LinguapopErrorType.Server
      retryable = true
    }

    return new LinguapopError(message, code, type, {
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
    return this.type === LinguapopErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LinguapopErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LinguapopErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LinguapopErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LinguapopErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LinguapopErrorType.Server
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

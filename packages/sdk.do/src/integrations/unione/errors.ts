/**
 * Unione Errors
 *
 * Auto-generated error handling for Unione Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/unione
 */

/**
 * Error type enum
 */
export enum UnioneErrorType {
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
 * Unione Error class
 *
 * Custom error class for Unione Integration operations.
 */
export class UnioneError extends Error {
  public readonly code: string | number
  public readonly type: UnioneErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: UnioneErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'UnioneError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnioneError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns UnioneError instance
   */
  static fromError(error: any): UnioneError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: UnioneErrorType; retryable: boolean }> = {
      '401': { type: UnioneErrorType.Authentication, retryable: false },
      '429': { type: UnioneErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new UnioneError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = UnioneErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = UnioneErrorType.Authentication
    } else if (statusCode === 403) {
      type = UnioneErrorType.Authorization
    } else if (statusCode === 404) {
      type = UnioneErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = UnioneErrorType.Validation
    } else if (statusCode === 429) {
      type = UnioneErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = UnioneErrorType.Server
      retryable = true
    }

    return new UnioneError(message, code, type, {
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
    return this.type === UnioneErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === UnioneErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === UnioneErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === UnioneErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === UnioneErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === UnioneErrorType.Server
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

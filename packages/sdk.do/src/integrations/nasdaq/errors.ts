/**
 * Nasdaq Errors
 *
 * Auto-generated error handling for Nasdaq Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/nasdaq
 */

/**
 * Error type enum
 */
export enum NasdaqErrorType {
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
 * Nasdaq Error class
 *
 * Custom error class for Nasdaq Integration operations.
 */
export class NasdaqError extends Error {
  public readonly code: string | number
  public readonly type: NasdaqErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: NasdaqErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'NasdaqError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NasdaqError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns NasdaqError instance
   */
  static fromError(error: any): NasdaqError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: NasdaqErrorType; retryable: boolean }> = {
      '401': { type: NasdaqErrorType.Authentication, retryable: false },
      '429': { type: NasdaqErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new NasdaqError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = NasdaqErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = NasdaqErrorType.Authentication
    } else if (statusCode === 403) {
      type = NasdaqErrorType.Authorization
    } else if (statusCode === 404) {
      type = NasdaqErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = NasdaqErrorType.Validation
    } else if (statusCode === 429) {
      type = NasdaqErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = NasdaqErrorType.Server
      retryable = true
    }

    return new NasdaqError(message, code, type, {
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
    return this.type === NasdaqErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === NasdaqErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === NasdaqErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === NasdaqErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === NasdaqErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === NasdaqErrorType.Server
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

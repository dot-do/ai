/**
 * Nasa Errors
 *
 * Auto-generated error handling for Nasa Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/nasa
 */

/**
 * Error type enum
 */
export enum NasaErrorType {
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
 * Nasa Error class
 *
 * Custom error class for Nasa Integration operations.
 */
export class NasaError extends Error {
  public readonly code: string | number
  public readonly type: NasaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: NasaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'NasaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NasaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns NasaError instance
   */
  static fromError(error: any): NasaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: NasaErrorType; retryable: boolean }> = {
      '401': { type: NasaErrorType.Authentication, retryable: false },
      '429': { type: NasaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new NasaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = NasaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = NasaErrorType.Authentication
    } else if (statusCode === 403) {
      type = NasaErrorType.Authorization
    } else if (statusCode === 404) {
      type = NasaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = NasaErrorType.Validation
    } else if (statusCode === 429) {
      type = NasaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = NasaErrorType.Server
      retryable = true
    }

    return new NasaError(message, code, type, {
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
    return this.type === NasaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === NasaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === NasaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === NasaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === NasaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === NasaErrorType.Server
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

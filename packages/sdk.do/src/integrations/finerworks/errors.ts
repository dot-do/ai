/**
 * Finerworks Errors
 *
 * Auto-generated error handling for Finerworks Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/finerworks
 */

/**
 * Error type enum
 */
export enum FinerworksErrorType {
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
 * Finerworks Error class
 *
 * Custom error class for Finerworks Integration operations.
 */
export class FinerworksError extends Error {
  public readonly code: string | number
  public readonly type: FinerworksErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FinerworksErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FinerworksError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FinerworksError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FinerworksError instance
   */
  static fromError(error: any): FinerworksError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FinerworksErrorType; retryable: boolean }> = {
      '401': { type: FinerworksErrorType.Authentication, retryable: false },
      '429': { type: FinerworksErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FinerworksError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FinerworksErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FinerworksErrorType.Authentication
    } else if (statusCode === 403) {
      type = FinerworksErrorType.Authorization
    } else if (statusCode === 404) {
      type = FinerworksErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FinerworksErrorType.Validation
    } else if (statusCode === 429) {
      type = FinerworksErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FinerworksErrorType.Server
      retryable = true
    }

    return new FinerworksError(message, code, type, {
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
    return this.type === FinerworksErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FinerworksErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FinerworksErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FinerworksErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FinerworksErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FinerworksErrorType.Server
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

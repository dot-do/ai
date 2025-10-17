/**
 * Accelo Errors
 *
 * Auto-generated error handling for Accelo Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/accelo
 */

/**
 * Error type enum
 */
export enum AcceloErrorType {
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
 * Accelo Error class
 *
 * Custom error class for Accelo Integration operations.
 */
export class AcceloError extends Error {
  public readonly code: string | number
  public readonly type: AcceloErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AcceloErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AcceloError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AcceloError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AcceloError instance
   */
  static fromError(error: any): AcceloError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AcceloErrorType; retryable: boolean }> = {
      '401': { type: AcceloErrorType.Authentication, retryable: false },
      '429': { type: AcceloErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AcceloError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AcceloErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AcceloErrorType.Authentication
    } else if (statusCode === 403) {
      type = AcceloErrorType.Authorization
    } else if (statusCode === 404) {
      type = AcceloErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AcceloErrorType.Validation
    } else if (statusCode === 429) {
      type = AcceloErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AcceloErrorType.Server
      retryable = true
    }

    return new AcceloError(message, code, type, {
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
    return this.type === AcceloErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AcceloErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AcceloErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AcceloErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AcceloErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AcceloErrorType.Server
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

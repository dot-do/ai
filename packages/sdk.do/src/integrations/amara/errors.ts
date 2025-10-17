/**
 * Amara Errors
 *
 * Auto-generated error handling for Amara Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/amara
 */

/**
 * Error type enum
 */
export enum AmaraErrorType {
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
 * Amara Error class
 *
 * Custom error class for Amara Integration operations.
 */
export class AmaraError extends Error {
  public readonly code: string | number
  public readonly type: AmaraErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AmaraErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AmaraError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AmaraError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AmaraError instance
   */
  static fromError(error: any): AmaraError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AmaraErrorType; retryable: boolean }> = {
      '401': { type: AmaraErrorType.Authentication, retryable: false },
      '429': { type: AmaraErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AmaraError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AmaraErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AmaraErrorType.Authentication
    } else if (statusCode === 403) {
      type = AmaraErrorType.Authorization
    } else if (statusCode === 404) {
      type = AmaraErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AmaraErrorType.Validation
    } else if (statusCode === 429) {
      type = AmaraErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AmaraErrorType.Server
      retryable = true
    }

    return new AmaraError(message, code, type, {
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
    return this.type === AmaraErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AmaraErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AmaraErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AmaraErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AmaraErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AmaraErrorType.Server
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

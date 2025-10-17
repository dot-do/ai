/**
 * Gamma Errors
 *
 * Auto-generated error handling for Gamma Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/gamma
 */

/**
 * Error type enum
 */
export enum GammaErrorType {
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
 * Gamma Error class
 *
 * Custom error class for Gamma Integration operations.
 */
export class GammaError extends Error {
  public readonly code: string | number
  public readonly type: GammaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GammaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GammaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GammaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GammaError instance
   */
  static fromError(error: any): GammaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GammaErrorType; retryable: boolean }> = {
      '401': { type: GammaErrorType.Authentication, retryable: false },
      '429': { type: GammaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GammaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GammaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GammaErrorType.Authentication
    } else if (statusCode === 403) {
      type = GammaErrorType.Authorization
    } else if (statusCode === 404) {
      type = GammaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GammaErrorType.Validation
    } else if (statusCode === 429) {
      type = GammaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GammaErrorType.Server
      retryable = true
    }

    return new GammaError(message, code, type, {
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
    return this.type === GammaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GammaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GammaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GammaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GammaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GammaErrorType.Server
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

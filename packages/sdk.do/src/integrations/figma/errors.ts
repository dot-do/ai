/**
 * Figma Errors
 *
 * Auto-generated error handling for Figma Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/figma
 */

/**
 * Error type enum
 */
export enum FigmaErrorType {
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
 * Figma Error class
 *
 * Custom error class for Figma Integration operations.
 */
export class FigmaError extends Error {
  public readonly code: string | number
  public readonly type: FigmaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FigmaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FigmaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FigmaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FigmaError instance
   */
  static fromError(error: any): FigmaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FigmaErrorType; retryable: boolean }> = {
      '401': { type: FigmaErrorType.Authentication, retryable: false },
      '429': { type: FigmaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FigmaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FigmaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FigmaErrorType.Authentication
    } else if (statusCode === 403) {
      type = FigmaErrorType.Authorization
    } else if (statusCode === 404) {
      type = FigmaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FigmaErrorType.Validation
    } else if (statusCode === 429) {
      type = FigmaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FigmaErrorType.Server
      retryable = true
    }

    return new FigmaError(message, code, type, {
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
    return this.type === FigmaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FigmaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FigmaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FigmaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FigmaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FigmaErrorType.Server
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

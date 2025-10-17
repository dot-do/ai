/**
 * Turbot pipes Errors
 *
 * Auto-generated error handling for Turbot pipes Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/turbot_pipes
 */

/**
 * Error type enum
 */
export enum TurbotPipesErrorType {
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
 * Turbot pipes Error class
 *
 * Custom error class for Turbot pipes Integration operations.
 */
export class TurbotPipesError extends Error {
  public readonly code: string | number
  public readonly type: TurbotPipesErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TurbotPipesErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TurbotPipesError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TurbotPipesError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TurbotPipesError instance
   */
  static fromError(error: any): TurbotPipesError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TurbotPipesErrorType; retryable: boolean }> = {
      '401': { type: TurbotPipesErrorType.Authentication, retryable: false },
      '429': { type: TurbotPipesErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TurbotPipesError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TurbotPipesErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TurbotPipesErrorType.Authentication
    } else if (statusCode === 403) {
      type = TurbotPipesErrorType.Authorization
    } else if (statusCode === 404) {
      type = TurbotPipesErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TurbotPipesErrorType.Validation
    } else if (statusCode === 429) {
      type = TurbotPipesErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TurbotPipesErrorType.Server
      retryable = true
    }

    return new TurbotPipesError(message, code, type, {
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
    return this.type === TurbotPipesErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TurbotPipesErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TurbotPipesErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TurbotPipesErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TurbotPipesErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TurbotPipesErrorType.Server
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

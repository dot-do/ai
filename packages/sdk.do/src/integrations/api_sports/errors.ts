/**
 * Api sports Errors
 *
 * Auto-generated error handling for Api sports Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/api_sports
 */

/**
 * Error type enum
 */
export enum ApiSportsErrorType {
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
 * Api sports Error class
 *
 * Custom error class for Api sports Integration operations.
 */
export class ApiSportsError extends Error {
  public readonly code: string | number
  public readonly type: ApiSportsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ApiSportsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ApiSportsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiSportsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ApiSportsError instance
   */
  static fromError(error: any): ApiSportsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ApiSportsErrorType; retryable: boolean }> = {
      '401': { type: ApiSportsErrorType.Authentication, retryable: false },
      '429': { type: ApiSportsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ApiSportsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ApiSportsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ApiSportsErrorType.Authentication
    } else if (statusCode === 403) {
      type = ApiSportsErrorType.Authorization
    } else if (statusCode === 404) {
      type = ApiSportsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ApiSportsErrorType.Validation
    } else if (statusCode === 429) {
      type = ApiSportsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ApiSportsErrorType.Server
      retryable = true
    }

    return new ApiSportsError(message, code, type, {
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
    return this.type === ApiSportsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ApiSportsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ApiSportsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ApiSportsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ApiSportsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ApiSportsErrorType.Server
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

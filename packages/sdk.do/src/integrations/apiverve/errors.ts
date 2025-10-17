/**
 * Apiverve Errors
 *
 * Auto-generated error handling for Apiverve Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/apiverve
 */

/**
 * Error type enum
 */
export enum ApiverveErrorType {
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
 * Apiverve Error class
 *
 * Custom error class for Apiverve Integration operations.
 */
export class ApiverveError extends Error {
  public readonly code: string | number
  public readonly type: ApiverveErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ApiverveErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ApiverveError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiverveError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ApiverveError instance
   */
  static fromError(error: any): ApiverveError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ApiverveErrorType; retryable: boolean }> = {
      '401': { type: ApiverveErrorType.Authentication, retryable: false },
      '429': { type: ApiverveErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ApiverveError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ApiverveErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ApiverveErrorType.Authentication
    } else if (statusCode === 403) {
      type = ApiverveErrorType.Authorization
    } else if (statusCode === 404) {
      type = ApiverveErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ApiverveErrorType.Validation
    } else if (statusCode === 429) {
      type = ApiverveErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ApiverveErrorType.Server
      retryable = true
    }

    return new ApiverveError(message, code, type, {
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
    return this.type === ApiverveErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ApiverveErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ApiverveErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ApiverveErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ApiverveErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ApiverveErrorType.Server
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

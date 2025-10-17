/**
 * Api labz Errors
 *
 * Auto-generated error handling for Api labz Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/api_labz
 */

/**
 * Error type enum
 */
export enum ApiLabzErrorType {
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
 * Api labz Error class
 *
 * Custom error class for Api labz Integration operations.
 */
export class ApiLabzError extends Error {
  public readonly code: string | number
  public readonly type: ApiLabzErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ApiLabzErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ApiLabzError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiLabzError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ApiLabzError instance
   */
  static fromError(error: any): ApiLabzError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ApiLabzErrorType; retryable: boolean }> = {
      '401': { type: ApiLabzErrorType.Authentication, retryable: false },
      '429': { type: ApiLabzErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ApiLabzError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ApiLabzErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ApiLabzErrorType.Authentication
    } else if (statusCode === 403) {
      type = ApiLabzErrorType.Authorization
    } else if (statusCode === 404) {
      type = ApiLabzErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ApiLabzErrorType.Validation
    } else if (statusCode === 429) {
      type = ApiLabzErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ApiLabzErrorType.Server
      retryable = true
    }

    return new ApiLabzError(message, code, type, {
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
    return this.type === ApiLabzErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ApiLabzErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ApiLabzErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ApiLabzErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ApiLabzErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ApiLabzErrorType.Server
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

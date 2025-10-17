/**
 * Api ninjas Errors
 *
 * Auto-generated error handling for Api ninjas Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/api_ninjas
 */

/**
 * Error type enum
 */
export enum ApiNinjasErrorType {
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
 * Api ninjas Error class
 *
 * Custom error class for Api ninjas Integration operations.
 */
export class ApiNinjasError extends Error {
  public readonly code: string | number
  public readonly type: ApiNinjasErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ApiNinjasErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ApiNinjasError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiNinjasError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ApiNinjasError instance
   */
  static fromError(error: any): ApiNinjasError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ApiNinjasErrorType; retryable: boolean }> = {
      '401': { type: ApiNinjasErrorType.Authentication, retryable: false },
      '429': { type: ApiNinjasErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ApiNinjasError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ApiNinjasErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ApiNinjasErrorType.Authentication
    } else if (statusCode === 403) {
      type = ApiNinjasErrorType.Authorization
    } else if (statusCode === 404) {
      type = ApiNinjasErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ApiNinjasErrorType.Validation
    } else if (statusCode === 429) {
      type = ApiNinjasErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ApiNinjasErrorType.Server
      retryable = true
    }

    return new ApiNinjasError(message, code, type, {
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
    return this.type === ApiNinjasErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ApiNinjasErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ApiNinjasErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ApiNinjasErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ApiNinjasErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ApiNinjasErrorType.Server
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

/**
 * Apiflash Errors
 *
 * Auto-generated error handling for Apiflash Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/apiflash
 */

/**
 * Error type enum
 */
export enum ApiflashErrorType {
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
 * Apiflash Error class
 *
 * Custom error class for Apiflash Integration operations.
 */
export class ApiflashError extends Error {
  public readonly code: string | number
  public readonly type: ApiflashErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ApiflashErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ApiflashError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiflashError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ApiflashError instance
   */
  static fromError(error: any): ApiflashError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ApiflashErrorType; retryable: boolean }> = {
      '401': { type: ApiflashErrorType.Authentication, retryable: false },
      '429': { type: ApiflashErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ApiflashError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ApiflashErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ApiflashErrorType.Authentication
    } else if (statusCode === 403) {
      type = ApiflashErrorType.Authorization
    } else if (statusCode === 404) {
      type = ApiflashErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ApiflashErrorType.Validation
    } else if (statusCode === 429) {
      type = ApiflashErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ApiflashErrorType.Server
      retryable = true
    }

    return new ApiflashError(message, code, type, {
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
    return this.type === ApiflashErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ApiflashErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ApiflashErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ApiflashErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ApiflashErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ApiflashErrorType.Server
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

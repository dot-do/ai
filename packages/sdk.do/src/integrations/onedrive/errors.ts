/**
 * OneDrive Errors
 *
 * Auto-generated error handling for OneDrive Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/onedrive
 */

/**
 * Error type enum
 */
export enum OnedriveErrorType {
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
 * OneDrive Error class
 *
 * Custom error class for OneDrive Integration operations.
 */
export class OnedriveError extends Error {
  public readonly code: string | number
  public readonly type: OnedriveErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: OnedriveErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'OnedriveError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OnedriveError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns OnedriveError instance
   */
  static fromError(error: any): OnedriveError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: OnedriveErrorType; retryable: boolean }> = {
      '401': { type: OnedriveErrorType.Authentication, retryable: false },
      '403': { type: OnedriveErrorType.Authorization, retryable: false },
      '404': { type: OnedriveErrorType.NotFound, retryable: false },
      '429': { type: OnedriveErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new OnedriveError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = OnedriveErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = OnedriveErrorType.Authentication
    } else if (statusCode === 403) {
      type = OnedriveErrorType.Authorization
    } else if (statusCode === 404) {
      type = OnedriveErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = OnedriveErrorType.Validation
    } else if (statusCode === 429) {
      type = OnedriveErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = OnedriveErrorType.Server
      retryable = true
    }

    return new OnedriveError(message, code, type, {
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
    return this.type === OnedriveErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === OnedriveErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === OnedriveErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === OnedriveErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === OnedriveErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === OnedriveErrorType.Server
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

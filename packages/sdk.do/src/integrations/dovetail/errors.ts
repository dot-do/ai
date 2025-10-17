/**
 * Dovetail Errors
 *
 * Auto-generated error handling for Dovetail Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/dovetail
 */

/**
 * Error type enum
 */
export enum DovetailErrorType {
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
 * Dovetail Error class
 *
 * Custom error class for Dovetail Integration operations.
 */
export class DovetailError extends Error {
  public readonly code: string | number
  public readonly type: DovetailErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DovetailErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DovetailError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DovetailError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DovetailError instance
   */
  static fromError(error: any): DovetailError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DovetailErrorType; retryable: boolean }> = {
      '401': { type: DovetailErrorType.Authentication, retryable: false },
      '429': { type: DovetailErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DovetailError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DovetailErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DovetailErrorType.Authentication
    } else if (statusCode === 403) {
      type = DovetailErrorType.Authorization
    } else if (statusCode === 404) {
      type = DovetailErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DovetailErrorType.Validation
    } else if (statusCode === 429) {
      type = DovetailErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DovetailErrorType.Server
      retryable = true
    }

    return new DovetailError(message, code, type, {
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
    return this.type === DovetailErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DovetailErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DovetailErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DovetailErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DovetailErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DovetailErrorType.Server
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

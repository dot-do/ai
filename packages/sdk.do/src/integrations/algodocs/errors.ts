/**
 * Algodocs Errors
 *
 * Auto-generated error handling for Algodocs Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/algodocs
 */

/**
 * Error type enum
 */
export enum AlgodocsErrorType {
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
 * Algodocs Error class
 *
 * Custom error class for Algodocs Integration operations.
 */
export class AlgodocsError extends Error {
  public readonly code: string | number
  public readonly type: AlgodocsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AlgodocsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AlgodocsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AlgodocsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AlgodocsError instance
   */
  static fromError(error: any): AlgodocsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AlgodocsErrorType; retryable: boolean }> = {
      '401': { type: AlgodocsErrorType.Authentication, retryable: false },
      '429': { type: AlgodocsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AlgodocsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AlgodocsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AlgodocsErrorType.Authentication
    } else if (statusCode === 403) {
      type = AlgodocsErrorType.Authorization
    } else if (statusCode === 404) {
      type = AlgodocsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AlgodocsErrorType.Validation
    } else if (statusCode === 429) {
      type = AlgodocsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AlgodocsErrorType.Server
      retryable = true
    }

    return new AlgodocsError(message, code, type, {
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
    return this.type === AlgodocsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AlgodocsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AlgodocsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AlgodocsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AlgodocsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AlgodocsErrorType.Server
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

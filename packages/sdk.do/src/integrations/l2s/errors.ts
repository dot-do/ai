/**
 * L2s Errors
 *
 * Auto-generated error handling for L2s Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/l2s
 */

/**
 * Error type enum
 */
export enum L2sErrorType {
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
 * L2s Error class
 *
 * Custom error class for L2s Integration operations.
 */
export class L2sError extends Error {
  public readonly code: string | number
  public readonly type: L2sErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: L2sErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'L2sError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, L2sError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns L2sError instance
   */
  static fromError(error: any): L2sError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: L2sErrorType; retryable: boolean }> = {
      '401': { type: L2sErrorType.Authentication, retryable: false },
      '429': { type: L2sErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new L2sError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = L2sErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = L2sErrorType.Authentication
    } else if (statusCode === 403) {
      type = L2sErrorType.Authorization
    } else if (statusCode === 404) {
      type = L2sErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = L2sErrorType.Validation
    } else if (statusCode === 429) {
      type = L2sErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = L2sErrorType.Server
      retryable = true
    }

    return new L2sError(message, code, type, {
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
    return this.type === L2sErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === L2sErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === L2sErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === L2sErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === L2sErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === L2sErrorType.Server
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

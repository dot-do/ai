/**
 * Crustdata Errors
 *
 * Auto-generated error handling for Crustdata Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/crustdata
 */

/**
 * Error type enum
 */
export enum CrustdataErrorType {
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
 * Crustdata Error class
 *
 * Custom error class for Crustdata Integration operations.
 */
export class CrustdataError extends Error {
  public readonly code: string | number
  public readonly type: CrustdataErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CrustdataErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CrustdataError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CrustdataError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CrustdataError instance
   */
  static fromError(error: any): CrustdataError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CrustdataErrorType; retryable: boolean }> = {
      '401': { type: CrustdataErrorType.Authentication, retryable: false },
      '429': { type: CrustdataErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CrustdataError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CrustdataErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CrustdataErrorType.Authentication
    } else if (statusCode === 403) {
      type = CrustdataErrorType.Authorization
    } else if (statusCode === 404) {
      type = CrustdataErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CrustdataErrorType.Validation
    } else if (statusCode === 429) {
      type = CrustdataErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CrustdataErrorType.Server
      retryable = true
    }

    return new CrustdataError(message, code, type, {
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
    return this.type === CrustdataErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CrustdataErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CrustdataErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CrustdataErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CrustdataErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CrustdataErrorType.Server
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

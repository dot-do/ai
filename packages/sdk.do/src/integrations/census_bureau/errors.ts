/**
 * Census bureau Errors
 *
 * Auto-generated error handling for Census bureau Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/census_bureau
 */

/**
 * Error type enum
 */
export enum CensusBureauErrorType {
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
 * Census bureau Error class
 *
 * Custom error class for Census bureau Integration operations.
 */
export class CensusBureauError extends Error {
  public readonly code: string | number
  public readonly type: CensusBureauErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CensusBureauErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CensusBureauError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CensusBureauError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CensusBureauError instance
   */
  static fromError(error: any): CensusBureauError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CensusBureauErrorType; retryable: boolean }> = {
      '401': { type: CensusBureauErrorType.Authentication, retryable: false },
      '429': { type: CensusBureauErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CensusBureauError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CensusBureauErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CensusBureauErrorType.Authentication
    } else if (statusCode === 403) {
      type = CensusBureauErrorType.Authorization
    } else if (statusCode === 404) {
      type = CensusBureauErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CensusBureauErrorType.Validation
    } else if (statusCode === 429) {
      type = CensusBureauErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CensusBureauErrorType.Server
      retryable = true
    }

    return new CensusBureauError(message, code, type, {
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
    return this.type === CensusBureauErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CensusBureauErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CensusBureauErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CensusBureauErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CensusBureauErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CensusBureauErrorType.Server
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

/**
 * Taxjar Errors
 *
 * Auto-generated error handling for Taxjar Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/taxjar
 */

/**
 * Error type enum
 */
export enum TaxjarErrorType {
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
 * Taxjar Error class
 *
 * Custom error class for Taxjar Integration operations.
 */
export class TaxjarError extends Error {
  public readonly code: string | number
  public readonly type: TaxjarErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TaxjarErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TaxjarError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TaxjarError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TaxjarError instance
   */
  static fromError(error: any): TaxjarError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TaxjarErrorType; retryable: boolean }> = {
      '401': { type: TaxjarErrorType.Authentication, retryable: false },
      '429': { type: TaxjarErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TaxjarError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TaxjarErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TaxjarErrorType.Authentication
    } else if (statusCode === 403) {
      type = TaxjarErrorType.Authorization
    } else if (statusCode === 404) {
      type = TaxjarErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TaxjarErrorType.Validation
    } else if (statusCode === 429) {
      type = TaxjarErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TaxjarErrorType.Server
      retryable = true
    }

    return new TaxjarError(message, code, type, {
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
    return this.type === TaxjarErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TaxjarErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TaxjarErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TaxjarErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TaxjarErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TaxjarErrorType.Server
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

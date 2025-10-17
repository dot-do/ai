/**
 * Productboard Errors
 *
 * Auto-generated error handling for Productboard Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/productboard
 */

/**
 * Error type enum
 */
export enum ProductboardErrorType {
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
 * Productboard Error class
 *
 * Custom error class for Productboard Integration operations.
 */
export class ProductboardError extends Error {
  public readonly code: string | number
  public readonly type: ProductboardErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ProductboardErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ProductboardError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ProductboardError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ProductboardError instance
   */
  static fromError(error: any): ProductboardError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ProductboardErrorType; retryable: boolean }> = {
      '401': { type: ProductboardErrorType.Authentication, retryable: false },
      '429': { type: ProductboardErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ProductboardError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ProductboardErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ProductboardErrorType.Authentication
    } else if (statusCode === 403) {
      type = ProductboardErrorType.Authorization
    } else if (statusCode === 404) {
      type = ProductboardErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ProductboardErrorType.Validation
    } else if (statusCode === 429) {
      type = ProductboardErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ProductboardErrorType.Server
      retryable = true
    }

    return new ProductboardError(message, code, type, {
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
    return this.type === ProductboardErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ProductboardErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ProductboardErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ProductboardErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ProductboardErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ProductboardErrorType.Server
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

/**
 * Productlane Errors
 *
 * Auto-generated error handling for Productlane Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/productlane
 */

/**
 * Error type enum
 */
export enum ProductlaneErrorType {
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
 * Productlane Error class
 *
 * Custom error class for Productlane Integration operations.
 */
export class ProductlaneError extends Error {
  public readonly code: string | number
  public readonly type: ProductlaneErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ProductlaneErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ProductlaneError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ProductlaneError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ProductlaneError instance
   */
  static fromError(error: any): ProductlaneError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ProductlaneErrorType; retryable: boolean }> = {
      '401': { type: ProductlaneErrorType.Authentication, retryable: false },
      '429': { type: ProductlaneErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ProductlaneError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ProductlaneErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ProductlaneErrorType.Authentication
    } else if (statusCode === 403) {
      type = ProductlaneErrorType.Authorization
    } else if (statusCode === 404) {
      type = ProductlaneErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ProductlaneErrorType.Validation
    } else if (statusCode === 429) {
      type = ProductlaneErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ProductlaneErrorType.Server
      retryable = true
    }

    return new ProductlaneError(message, code, type, {
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
    return this.type === ProductlaneErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ProductlaneErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ProductlaneErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ProductlaneErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ProductlaneErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ProductlaneErrorType.Server
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

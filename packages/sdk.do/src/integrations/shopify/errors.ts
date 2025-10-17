/**
 * Shopify Errors
 *
 * Auto-generated error handling for Shopify Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/shopify
 */

/**
 * Error type enum
 */
export enum ShopifyErrorType {
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
 * Shopify Error class
 *
 * Custom error class for Shopify Integration operations.
 */
export class ShopifyError extends Error {
  public readonly code: string | number
  public readonly type: ShopifyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ShopifyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ShopifyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ShopifyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ShopifyError instance
   */
  static fromError(error: any): ShopifyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ShopifyErrorType; retryable: boolean }> = {
      '401': { type: ShopifyErrorType.Authentication, retryable: false },
      '429': { type: ShopifyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ShopifyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ShopifyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ShopifyErrorType.Authentication
    } else if (statusCode === 403) {
      type = ShopifyErrorType.Authorization
    } else if (statusCode === 404) {
      type = ShopifyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ShopifyErrorType.Validation
    } else if (statusCode === 429) {
      type = ShopifyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ShopifyErrorType.Server
      retryable = true
    }

    return new ShopifyError(message, code, type, {
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
    return this.type === ShopifyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ShopifyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ShopifyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ShopifyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ShopifyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ShopifyErrorType.Server
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

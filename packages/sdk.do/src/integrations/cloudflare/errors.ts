/**
 * Cloudflare Errors
 *
 * Auto-generated error handling for Cloudflare Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/cloudflare
 */

/**
 * Error type enum
 */
export enum CloudflareErrorType {
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
 * Cloudflare Error class
 *
 * Custom error class for Cloudflare Integration operations.
 */
export class CloudflareError extends Error {
  public readonly code: string | number
  public readonly type: CloudflareErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CloudflareErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CloudflareError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CloudflareError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CloudflareError instance
   */
  static fromError(error: any): CloudflareError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CloudflareErrorType; retryable: boolean }> = {
      '401': { type: CloudflareErrorType.Authentication, retryable: false },
      '429': { type: CloudflareErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CloudflareError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CloudflareErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CloudflareErrorType.Authentication
    } else if (statusCode === 403) {
      type = CloudflareErrorType.Authorization
    } else if (statusCode === 404) {
      type = CloudflareErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CloudflareErrorType.Validation
    } else if (statusCode === 429) {
      type = CloudflareErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CloudflareErrorType.Server
      retryable = true
    }

    return new CloudflareError(message, code, type, {
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
    return this.type === CloudflareErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CloudflareErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CloudflareErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CloudflareErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CloudflareErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CloudflareErrorType.Server
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

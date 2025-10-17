/**
 * Linkup Errors
 *
 * Auto-generated error handling for Linkup Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/linkup
 */

/**
 * Error type enum
 */
export enum LinkupErrorType {
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
 * Linkup Error class
 *
 * Custom error class for Linkup Integration operations.
 */
export class LinkupError extends Error {
  public readonly code: string | number
  public readonly type: LinkupErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LinkupErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LinkupError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LinkupError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LinkupError instance
   */
  static fromError(error: any): LinkupError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LinkupErrorType; retryable: boolean }> = {
      '401': { type: LinkupErrorType.Authentication, retryable: false },
      '429': { type: LinkupErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LinkupError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LinkupErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LinkupErrorType.Authentication
    } else if (statusCode === 403) {
      type = LinkupErrorType.Authorization
    } else if (statusCode === 404) {
      type = LinkupErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LinkupErrorType.Validation
    } else if (statusCode === 429) {
      type = LinkupErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LinkupErrorType.Server
      retryable = true
    }

    return new LinkupError(message, code, type, {
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
    return this.type === LinkupErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LinkupErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LinkupErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LinkupErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LinkupErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LinkupErrorType.Server
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

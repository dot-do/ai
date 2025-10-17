/**
 * Share point Errors
 *
 * Auto-generated error handling for Share point Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/share_point
 */

/**
 * Error type enum
 */
export enum SharePointErrorType {
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
 * Share point Error class
 *
 * Custom error class for Share point Integration operations.
 */
export class SharePointError extends Error {
  public readonly code: string | number
  public readonly type: SharePointErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SharePointErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SharePointError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SharePointError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SharePointError instance
   */
  static fromError(error: any): SharePointError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SharePointErrorType; retryable: boolean }> = {
      '401': { type: SharePointErrorType.Authentication, retryable: false },
      '429': { type: SharePointErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SharePointError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SharePointErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SharePointErrorType.Authentication
    } else if (statusCode === 403) {
      type = SharePointErrorType.Authorization
    } else if (statusCode === 404) {
      type = SharePointErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SharePointErrorType.Validation
    } else if (statusCode === 429) {
      type = SharePointErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SharePointErrorType.Server
      retryable = true
    }

    return new SharePointError(message, code, type, {
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
    return this.type === SharePointErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SharePointErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SharePointErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SharePointErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SharePointErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SharePointErrorType.Server
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

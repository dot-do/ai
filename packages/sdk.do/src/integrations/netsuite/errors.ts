/**
 * Netsuite Errors
 *
 * Auto-generated error handling for Netsuite Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/netsuite
 */

/**
 * Error type enum
 */
export enum NetsuiteErrorType {
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
 * Netsuite Error class
 *
 * Custom error class for Netsuite Integration operations.
 */
export class NetsuiteError extends Error {
  public readonly code: string | number
  public readonly type: NetsuiteErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: NetsuiteErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'NetsuiteError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetsuiteError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns NetsuiteError instance
   */
  static fromError(error: any): NetsuiteError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: NetsuiteErrorType; retryable: boolean }> = {
      '401': { type: NetsuiteErrorType.Authentication, retryable: false },
      '429': { type: NetsuiteErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new NetsuiteError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = NetsuiteErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = NetsuiteErrorType.Authentication
    } else if (statusCode === 403) {
      type = NetsuiteErrorType.Authorization
    } else if (statusCode === 404) {
      type = NetsuiteErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = NetsuiteErrorType.Validation
    } else if (statusCode === 429) {
      type = NetsuiteErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = NetsuiteErrorType.Server
      retryable = true
    }

    return new NetsuiteError(message, code, type, {
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
    return this.type === NetsuiteErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === NetsuiteErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === NetsuiteErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === NetsuiteErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === NetsuiteErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === NetsuiteErrorType.Server
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

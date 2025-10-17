/**
 * Ip2proxy Errors
 *
 * Auto-generated error handling for Ip2proxy Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ip2proxy
 */

/**
 * Error type enum
 */
export enum Ip2proxyErrorType {
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
 * Ip2proxy Error class
 *
 * Custom error class for Ip2proxy Integration operations.
 */
export class Ip2proxyError extends Error {
  public readonly code: string | number
  public readonly type: Ip2proxyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: Ip2proxyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'Ip2proxyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Ip2proxyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns Ip2proxyError instance
   */
  static fromError(error: any): Ip2proxyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: Ip2proxyErrorType; retryable: boolean }> = {
      '401': { type: Ip2proxyErrorType.Authentication, retryable: false },
      '429': { type: Ip2proxyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new Ip2proxyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = Ip2proxyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = Ip2proxyErrorType.Authentication
    } else if (statusCode === 403) {
      type = Ip2proxyErrorType.Authorization
    } else if (statusCode === 404) {
      type = Ip2proxyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = Ip2proxyErrorType.Validation
    } else if (statusCode === 429) {
      type = Ip2proxyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = Ip2proxyErrorType.Server
      retryable = true
    }

    return new Ip2proxyError(message, code, type, {
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
    return this.type === Ip2proxyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === Ip2proxyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === Ip2proxyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === Ip2proxyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === Ip2proxyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === Ip2proxyErrorType.Server
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

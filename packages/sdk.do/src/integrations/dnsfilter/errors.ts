/**
 * Dnsfilter Errors
 *
 * Auto-generated error handling for Dnsfilter Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/dnsfilter
 */

/**
 * Error type enum
 */
export enum DnsfilterErrorType {
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
 * Dnsfilter Error class
 *
 * Custom error class for Dnsfilter Integration operations.
 */
export class DnsfilterError extends Error {
  public readonly code: string | number
  public readonly type: DnsfilterErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DnsfilterErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DnsfilterError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DnsfilterError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DnsfilterError instance
   */
  static fromError(error: any): DnsfilterError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DnsfilterErrorType; retryable: boolean }> = {
      '401': { type: DnsfilterErrorType.Authentication, retryable: false },
      '429': { type: DnsfilterErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DnsfilterError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DnsfilterErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DnsfilterErrorType.Authentication
    } else if (statusCode === 403) {
      type = DnsfilterErrorType.Authorization
    } else if (statusCode === 404) {
      type = DnsfilterErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DnsfilterErrorType.Validation
    } else if (statusCode === 429) {
      type = DnsfilterErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DnsfilterErrorType.Server
      retryable = true
    }

    return new DnsfilterError(message, code, type, {
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
    return this.type === DnsfilterErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DnsfilterErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DnsfilterErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DnsfilterErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DnsfilterErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DnsfilterErrorType.Server
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

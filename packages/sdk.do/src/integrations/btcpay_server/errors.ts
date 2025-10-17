/**
 * Btcpay server Errors
 *
 * Auto-generated error handling for Btcpay server Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/btcpay_server
 */

/**
 * Error type enum
 */
export enum BtcpayServerErrorType {
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
 * Btcpay server Error class
 *
 * Custom error class for Btcpay server Integration operations.
 */
export class BtcpayServerError extends Error {
  public readonly code: string | number
  public readonly type: BtcpayServerErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BtcpayServerErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BtcpayServerError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BtcpayServerError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BtcpayServerError instance
   */
  static fromError(error: any): BtcpayServerError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BtcpayServerErrorType; retryable: boolean }> = {
      '401': { type: BtcpayServerErrorType.Authentication, retryable: false },
      '429': { type: BtcpayServerErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BtcpayServerError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BtcpayServerErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BtcpayServerErrorType.Authentication
    } else if (statusCode === 403) {
      type = BtcpayServerErrorType.Authorization
    } else if (statusCode === 404) {
      type = BtcpayServerErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BtcpayServerErrorType.Validation
    } else if (statusCode === 429) {
      type = BtcpayServerErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BtcpayServerErrorType.Server
      retryable = true
    }

    return new BtcpayServerError(message, code, type, {
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
    return this.type === BtcpayServerErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BtcpayServerErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BtcpayServerErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BtcpayServerErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BtcpayServerErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BtcpayServerErrorType.Server
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

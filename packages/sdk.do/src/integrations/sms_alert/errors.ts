/**
 * Sms alert Errors
 *
 * Auto-generated error handling for Sms alert Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sms_alert
 */

/**
 * Error type enum
 */
export enum SmsAlertErrorType {
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
 * Sms alert Error class
 *
 * Custom error class for Sms alert Integration operations.
 */
export class SmsAlertError extends Error {
  public readonly code: string | number
  public readonly type: SmsAlertErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SmsAlertErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SmsAlertError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SmsAlertError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SmsAlertError instance
   */
  static fromError(error: any): SmsAlertError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SmsAlertErrorType; retryable: boolean }> = {
      '401': { type: SmsAlertErrorType.Authentication, retryable: false },
      '429': { type: SmsAlertErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SmsAlertError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SmsAlertErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SmsAlertErrorType.Authentication
    } else if (statusCode === 403) {
      type = SmsAlertErrorType.Authorization
    } else if (statusCode === 404) {
      type = SmsAlertErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SmsAlertErrorType.Validation
    } else if (statusCode === 429) {
      type = SmsAlertErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SmsAlertErrorType.Server
      retryable = true
    }

    return new SmsAlertError(message, code, type, {
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
    return this.type === SmsAlertErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SmsAlertErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SmsAlertErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SmsAlertErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SmsAlertErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SmsAlertErrorType.Server
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

/**
 * Whatsapp Errors
 *
 * Auto-generated error handling for Whatsapp Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/whatsapp
 */

/**
 * Error type enum
 */
export enum WhatsappErrorType {
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
 * Whatsapp Error class
 *
 * Custom error class for Whatsapp Integration operations.
 */
export class WhatsappError extends Error {
  public readonly code: string | number
  public readonly type: WhatsappErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WhatsappErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WhatsappError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WhatsappError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WhatsappError instance
   */
  static fromError(error: any): WhatsappError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WhatsappErrorType; retryable: boolean }> = {
      '401': { type: WhatsappErrorType.Authentication, retryable: false },
      '429': { type: WhatsappErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WhatsappError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WhatsappErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WhatsappErrorType.Authentication
    } else if (statusCode === 403) {
      type = WhatsappErrorType.Authorization
    } else if (statusCode === 404) {
      type = WhatsappErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WhatsappErrorType.Validation
    } else if (statusCode === 429) {
      type = WhatsappErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WhatsappErrorType.Server
      retryable = true
    }

    return new WhatsappError(message, code, type, {
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
    return this.type === WhatsappErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WhatsappErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WhatsappErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WhatsappErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WhatsappErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WhatsappErrorType.Server
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

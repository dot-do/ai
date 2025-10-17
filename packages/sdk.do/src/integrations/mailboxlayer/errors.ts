/**
 * Mailboxlayer Errors
 *
 * Auto-generated error handling for Mailboxlayer Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mailboxlayer
 */

/**
 * Error type enum
 */
export enum MailboxlayerErrorType {
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
 * Mailboxlayer Error class
 *
 * Custom error class for Mailboxlayer Integration operations.
 */
export class MailboxlayerError extends Error {
  public readonly code: string | number
  public readonly type: MailboxlayerErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MailboxlayerErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MailboxlayerError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MailboxlayerError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MailboxlayerError instance
   */
  static fromError(error: any): MailboxlayerError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MailboxlayerErrorType; retryable: boolean }> = {
      '401': { type: MailboxlayerErrorType.Authentication, retryable: false },
      '429': { type: MailboxlayerErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MailboxlayerError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MailboxlayerErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MailboxlayerErrorType.Authentication
    } else if (statusCode === 403) {
      type = MailboxlayerErrorType.Authorization
    } else if (statusCode === 404) {
      type = MailboxlayerErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MailboxlayerErrorType.Validation
    } else if (statusCode === 429) {
      type = MailboxlayerErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MailboxlayerErrorType.Server
      retryable = true
    }

    return new MailboxlayerError(message, code, type, {
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
    return this.type === MailboxlayerErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MailboxlayerErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MailboxlayerErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MailboxlayerErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MailboxlayerErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MailboxlayerErrorType.Server
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

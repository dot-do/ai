/**
 * Mailchimp Errors
 *
 * Auto-generated error handling for Mailchimp Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mailchimp
 */

/**
 * Error type enum
 */
export enum MailchimpErrorType {
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
 * Mailchimp Error class
 *
 * Custom error class for Mailchimp Integration operations.
 */
export class MailchimpError extends Error {
  public readonly code: string | number
  public readonly type: MailchimpErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MailchimpErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MailchimpError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MailchimpError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MailchimpError instance
   */
  static fromError(error: any): MailchimpError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MailchimpErrorType; retryable: boolean }> = {
      invalid_api_key: { type: MailchimpErrorType.Authentication, retryable: false },
      forbidden: { type: MailchimpErrorType.Authorization, retryable: false },
      resource_not_found: { type: MailchimpErrorType.NotFound, retryable: false },
      invalid_resource: { type: MailchimpErrorType.Validation, retryable: false },
      too_many_requests: { type: MailchimpErrorType.RateLimit, retryable: true },
      internal_server_error: { type: MailchimpErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MailchimpError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MailchimpErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MailchimpErrorType.Authentication
    } else if (statusCode === 403) {
      type = MailchimpErrorType.Authorization
    } else if (statusCode === 404) {
      type = MailchimpErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MailchimpErrorType.Validation
    } else if (statusCode === 429) {
      type = MailchimpErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MailchimpErrorType.Server
      retryable = true
    }

    return new MailchimpError(message, code, type, {
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
    return this.type === MailchimpErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MailchimpErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MailchimpErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MailchimpErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MailchimpErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MailchimpErrorType.Server
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

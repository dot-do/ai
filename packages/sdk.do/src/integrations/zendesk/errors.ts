/**
 * Zendesk Errors
 *
 * Auto-generated error handling for Zendesk Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/zendesk
 */

/**
 * Error type enum
 */
export enum ZendeskErrorType {
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
 * Zendesk Error class
 *
 * Custom error class for Zendesk Integration operations.
 */
export class ZendeskError extends Error {
  public readonly code: string | number
  public readonly type: ZendeskErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ZendeskErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ZendeskError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZendeskError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ZendeskError instance
   */
  static fromError(error: any): ZendeskError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ZendeskErrorType; retryable: boolean }> = {
      invalid_token: { type: ZendeskErrorType.Authentication, retryable: false },
      forbidden: { type: ZendeskErrorType.Authorization, retryable: false },
      not_found: { type: ZendeskErrorType.NotFound, retryable: false },
      unprocessable_entity: { type: ZendeskErrorType.Validation, retryable: false },
      too_many_requests: { type: ZendeskErrorType.RateLimit, retryable: true },
      internal_server_error: { type: ZendeskErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ZendeskError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ZendeskErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ZendeskErrorType.Authentication
    } else if (statusCode === 403) {
      type = ZendeskErrorType.Authorization
    } else if (statusCode === 404) {
      type = ZendeskErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ZendeskErrorType.Validation
    } else if (statusCode === 429) {
      type = ZendeskErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ZendeskErrorType.Server
      retryable = true
    }

    return new ZendeskError(message, code, type, {
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
    return this.type === ZendeskErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ZendeskErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ZendeskErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ZendeskErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ZendeskErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ZendeskErrorType.Server
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

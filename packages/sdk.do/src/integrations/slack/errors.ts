/**
 * Slack Errors
 *
 * Auto-generated error handling for Slack Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/slack
 */

/**
 * Error type enum
 */
export enum SlackErrorType {
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
 * Slack Error class
 *
 * Custom error class for Slack Integration operations.
 */
export class SlackError extends Error {
  public readonly code: string | number
  public readonly type: SlackErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SlackErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SlackError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SlackError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SlackError instance
   */
  static fromError(error: any): SlackError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SlackErrorType; retryable: boolean }> = {
      not_authed: { type: SlackErrorType.Authentication, retryable: false },
      invalid_auth: { type: SlackErrorType.Authentication, retryable: false },
      token_revoked: { type: SlackErrorType.Authentication, retryable: false },
      token_expired: { type: SlackErrorType.Authentication, retryable: false },
      account_inactive: { type: SlackErrorType.Authorization, retryable: false },
      missing_scope: { type: SlackErrorType.Authorization, retryable: false },
      not_allowed_token_type: { type: SlackErrorType.Authorization, retryable: false },
      channel_not_found: { type: SlackErrorType.NotFound, retryable: false },
      user_not_found: { type: SlackErrorType.NotFound, retryable: false },
      file_not_found: { type: SlackErrorType.NotFound, retryable: false },
      message_not_found: { type: SlackErrorType.NotFound, retryable: false },
      invalid_arguments: { type: SlackErrorType.Validation, retryable: false },
      invalid_name: { type: SlackErrorType.Validation, retryable: false },
      invalid_channel: { type: SlackErrorType.Validation, retryable: false },
      cant_invite_self: { type: SlackErrorType.Validation, retryable: false },
      already_in_channel: { type: SlackErrorType.Validation, retryable: false },
      cant_kick_self: { type: SlackErrorType.Validation, retryable: false },
      cant_archive_general: { type: SlackErrorType.Validation, retryable: false },
      name_taken: { type: SlackErrorType.Validation, retryable: false },
      restricted_action: { type: SlackErrorType.Validation, retryable: false },
      rate_limited: { type: SlackErrorType.RateLimit, retryable: true },
      internal_error: { type: SlackErrorType.Server, retryable: true },
      fatal_error: { type: SlackErrorType.Server, retryable: true },
      service_unavailable: { type: SlackErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SlackError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SlackErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SlackErrorType.Authentication
    } else if (statusCode === 403) {
      type = SlackErrorType.Authorization
    } else if (statusCode === 404) {
      type = SlackErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SlackErrorType.Validation
    } else if (statusCode === 429) {
      type = SlackErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SlackErrorType.Server
      retryable = true
    }

    return new SlackError(message, code, type, {
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
    return this.type === SlackErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SlackErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SlackErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SlackErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SlackErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SlackErrorType.Server
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

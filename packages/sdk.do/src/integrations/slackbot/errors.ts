/**
 * Slackbot Errors
 *
 * Auto-generated error handling for Slackbot Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/slackbot
 */

/**
 * Error type enum
 */
export enum SlackbotErrorType {
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
 * Slackbot Error class
 *
 * Custom error class for Slackbot Integration operations.
 */
export class SlackbotError extends Error {
  public readonly code: string | number
  public readonly type: SlackbotErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SlackbotErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SlackbotError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SlackbotError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SlackbotError instance
   */
  static fromError(error: any): SlackbotError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SlackbotErrorType; retryable: boolean }> = {
      '401': { type: SlackbotErrorType.Authentication, retryable: false },
      '429': { type: SlackbotErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SlackbotError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SlackbotErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SlackbotErrorType.Authentication
    } else if (statusCode === 403) {
      type = SlackbotErrorType.Authorization
    } else if (statusCode === 404) {
      type = SlackbotErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SlackbotErrorType.Validation
    } else if (statusCode === 429) {
      type = SlackbotErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SlackbotErrorType.Server
      retryable = true
    }

    return new SlackbotError(message, code, type, {
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
    return this.type === SlackbotErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SlackbotErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SlackbotErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SlackbotErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SlackbotErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SlackbotErrorType.Server
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

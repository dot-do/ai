/**
 * Mixpanel Errors
 *
 * Auto-generated error handling for Mixpanel Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mixpanel
 */

/**
 * Error type enum
 */
export enum MixpanelErrorType {
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
 * Mixpanel Error class
 *
 * Custom error class for Mixpanel Integration operations.
 */
export class MixpanelError extends Error {
  public readonly code: string | number
  public readonly type: MixpanelErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MixpanelErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MixpanelError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MixpanelError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MixpanelError instance
   */
  static fromError(error: any): MixpanelError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MixpanelErrorType; retryable: boolean }> = {
      invalid_token: { type: MixpanelErrorType.Authentication, retryable: false },
      forbidden: { type: MixpanelErrorType.Authorization, retryable: false },
      invalid_request: { type: MixpanelErrorType.Validation, retryable: false },
      rate_limit: { type: MixpanelErrorType.RateLimit, retryable: true },
      server_error: { type: MixpanelErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MixpanelError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MixpanelErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MixpanelErrorType.Authentication
    } else if (statusCode === 403) {
      type = MixpanelErrorType.Authorization
    } else if (statusCode === 404) {
      type = MixpanelErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MixpanelErrorType.Validation
    } else if (statusCode === 429) {
      type = MixpanelErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MixpanelErrorType.Server
      retryable = true
    }

    return new MixpanelError(message, code, type, {
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
    return this.type === MixpanelErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MixpanelErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MixpanelErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MixpanelErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MixpanelErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MixpanelErrorType.Server
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

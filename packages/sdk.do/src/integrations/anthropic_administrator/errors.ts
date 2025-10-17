/**
 * Anthropic administrator Errors
 *
 * Auto-generated error handling for Anthropic administrator Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/anthropic_administrator
 */

/**
 * Error type enum
 */
export enum AnthropicAdministratorErrorType {
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
 * Anthropic administrator Error class
 *
 * Custom error class for Anthropic administrator Integration operations.
 */
export class AnthropicAdministratorError extends Error {
  public readonly code: string | number
  public readonly type: AnthropicAdministratorErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AnthropicAdministratorErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AnthropicAdministratorError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AnthropicAdministratorError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AnthropicAdministratorError instance
   */
  static fromError(error: any): AnthropicAdministratorError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AnthropicAdministratorErrorType; retryable: boolean }> = {
      '401': { type: AnthropicAdministratorErrorType.Authentication, retryable: false },
      '429': { type: AnthropicAdministratorErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AnthropicAdministratorError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AnthropicAdministratorErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AnthropicAdministratorErrorType.Authentication
    } else if (statusCode === 403) {
      type = AnthropicAdministratorErrorType.Authorization
    } else if (statusCode === 404) {
      type = AnthropicAdministratorErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AnthropicAdministratorErrorType.Validation
    } else if (statusCode === 429) {
      type = AnthropicAdministratorErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AnthropicAdministratorErrorType.Server
      retryable = true
    }

    return new AnthropicAdministratorError(message, code, type, {
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
    return this.type === AnthropicAdministratorErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AnthropicAdministratorErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AnthropicAdministratorErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AnthropicAdministratorErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AnthropicAdministratorErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AnthropicAdministratorErrorType.Server
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

/**
 * Supportbee Errors
 *
 * Auto-generated error handling for Supportbee Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/supportbee
 */

/**
 * Error type enum
 */
export enum SupportbeeErrorType {
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
 * Supportbee Error class
 *
 * Custom error class for Supportbee Integration operations.
 */
export class SupportbeeError extends Error {
  public readonly code: string | number
  public readonly type: SupportbeeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SupportbeeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SupportbeeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SupportbeeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SupportbeeError instance
   */
  static fromError(error: any): SupportbeeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SupportbeeErrorType; retryable: boolean }> = {
      '401': { type: SupportbeeErrorType.Authentication, retryable: false },
      '429': { type: SupportbeeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SupportbeeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SupportbeeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SupportbeeErrorType.Authentication
    } else if (statusCode === 403) {
      type = SupportbeeErrorType.Authorization
    } else if (statusCode === 404) {
      type = SupportbeeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SupportbeeErrorType.Validation
    } else if (statusCode === 429) {
      type = SupportbeeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SupportbeeErrorType.Server
      retryable = true
    }

    return new SupportbeeError(message, code, type, {
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
    return this.type === SupportbeeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SupportbeeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SupportbeeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SupportbeeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SupportbeeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SupportbeeErrorType.Server
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

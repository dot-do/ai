/**
 * Triggercmd Errors
 *
 * Auto-generated error handling for Triggercmd Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/triggercmd
 */

/**
 * Error type enum
 */
export enum TriggercmdErrorType {
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
 * Triggercmd Error class
 *
 * Custom error class for Triggercmd Integration operations.
 */
export class TriggercmdError extends Error {
  public readonly code: string | number
  public readonly type: TriggercmdErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TriggercmdErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TriggercmdError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TriggercmdError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TriggercmdError instance
   */
  static fromError(error: any): TriggercmdError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TriggercmdErrorType; retryable: boolean }> = {
      '401': { type: TriggercmdErrorType.Authentication, retryable: false },
      '429': { type: TriggercmdErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TriggercmdError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TriggercmdErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TriggercmdErrorType.Authentication
    } else if (statusCode === 403) {
      type = TriggercmdErrorType.Authorization
    } else if (statusCode === 404) {
      type = TriggercmdErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TriggercmdErrorType.Validation
    } else if (statusCode === 429) {
      type = TriggercmdErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TriggercmdErrorType.Server
      retryable = true
    }

    return new TriggercmdError(message, code, type, {
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
    return this.type === TriggercmdErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TriggercmdErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TriggercmdErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TriggercmdErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TriggercmdErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TriggercmdErrorType.Server
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

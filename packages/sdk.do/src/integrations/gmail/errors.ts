/**
 * Gmail Errors
 *
 * Auto-generated error handling for Gmail Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/gmail
 */

/**
 * Error type enum
 */
export enum GmailErrorType {
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
 * Gmail Error class
 *
 * Custom error class for Gmail Integration operations.
 */
export class GmailError extends Error {
  public readonly code: string | number
  public readonly type: GmailErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GmailErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GmailError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GmailError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GmailError instance
   */
  static fromError(error: any): GmailError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GmailErrorType; retryable: boolean }> = {
      '401': { type: GmailErrorType.Authentication, retryable: false },
      '429': { type: GmailErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GmailError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GmailErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GmailErrorType.Authentication
    } else if (statusCode === 403) {
      type = GmailErrorType.Authorization
    } else if (statusCode === 404) {
      type = GmailErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GmailErrorType.Validation
    } else if (statusCode === 429) {
      type = GmailErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GmailErrorType.Server
      retryable = true
    }

    return new GmailError(message, code, type, {
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
    return this.type === GmailErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GmailErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GmailErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GmailErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GmailErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GmailErrorType.Server
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

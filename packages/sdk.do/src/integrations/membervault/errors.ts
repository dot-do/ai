/**
 * Membervault Errors
 *
 * Auto-generated error handling for Membervault Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/membervault
 */

/**
 * Error type enum
 */
export enum MembervaultErrorType {
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
 * Membervault Error class
 *
 * Custom error class for Membervault Integration operations.
 */
export class MembervaultError extends Error {
  public readonly code: string | number
  public readonly type: MembervaultErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MembervaultErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MembervaultError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MembervaultError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MembervaultError instance
   */
  static fromError(error: any): MembervaultError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MembervaultErrorType; retryable: boolean }> = {
      '401': { type: MembervaultErrorType.Authentication, retryable: false },
      '429': { type: MembervaultErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MembervaultError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MembervaultErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MembervaultErrorType.Authentication
    } else if (statusCode === 403) {
      type = MembervaultErrorType.Authorization
    } else if (statusCode === 404) {
      type = MembervaultErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MembervaultErrorType.Validation
    } else if (statusCode === 429) {
      type = MembervaultErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MembervaultErrorType.Server
      retryable = true
    }

    return new MembervaultError(message, code, type, {
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
    return this.type === MembervaultErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MembervaultErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MembervaultErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MembervaultErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MembervaultErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MembervaultErrorType.Server
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

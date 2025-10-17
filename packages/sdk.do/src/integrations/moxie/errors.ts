/**
 * Moxie Errors
 *
 * Auto-generated error handling for Moxie Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/moxie
 */

/**
 * Error type enum
 */
export enum MoxieErrorType {
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
 * Moxie Error class
 *
 * Custom error class for Moxie Integration operations.
 */
export class MoxieError extends Error {
  public readonly code: string | number
  public readonly type: MoxieErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MoxieErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MoxieError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MoxieError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MoxieError instance
   */
  static fromError(error: any): MoxieError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MoxieErrorType; retryable: boolean }> = {
      '401': { type: MoxieErrorType.Authentication, retryable: false },
      '429': { type: MoxieErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MoxieError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MoxieErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MoxieErrorType.Authentication
    } else if (statusCode === 403) {
      type = MoxieErrorType.Authorization
    } else if (statusCode === 404) {
      type = MoxieErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MoxieErrorType.Validation
    } else if (statusCode === 429) {
      type = MoxieErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MoxieErrorType.Server
      retryable = true
    }

    return new MoxieError(message, code, type, {
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
    return this.type === MoxieErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MoxieErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MoxieErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MoxieErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MoxieErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MoxieErrorType.Server
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

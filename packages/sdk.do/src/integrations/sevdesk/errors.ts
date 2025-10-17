/**
 * Sevdesk Errors
 *
 * Auto-generated error handling for Sevdesk Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sevdesk
 */

/**
 * Error type enum
 */
export enum SevdeskErrorType {
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
 * Sevdesk Error class
 *
 * Custom error class for Sevdesk Integration operations.
 */
export class SevdeskError extends Error {
  public readonly code: string | number
  public readonly type: SevdeskErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SevdeskErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SevdeskError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SevdeskError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SevdeskError instance
   */
  static fromError(error: any): SevdeskError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SevdeskErrorType; retryable: boolean }> = {
      '401': { type: SevdeskErrorType.Authentication, retryable: false },
      '429': { type: SevdeskErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SevdeskError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SevdeskErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SevdeskErrorType.Authentication
    } else if (statusCode === 403) {
      type = SevdeskErrorType.Authorization
    } else if (statusCode === 404) {
      type = SevdeskErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SevdeskErrorType.Validation
    } else if (statusCode === 429) {
      type = SevdeskErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SevdeskErrorType.Server
      retryable = true
    }

    return new SevdeskError(message, code, type, {
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
    return this.type === SevdeskErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SevdeskErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SevdeskErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SevdeskErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SevdeskErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SevdeskErrorType.Server
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

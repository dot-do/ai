/**
 * Helpdesk Errors
 *
 * Auto-generated error handling for Helpdesk Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/helpdesk
 */

/**
 * Error type enum
 */
export enum HelpdeskErrorType {
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
 * Helpdesk Error class
 *
 * Custom error class for Helpdesk Integration operations.
 */
export class HelpdeskError extends Error {
  public readonly code: string | number
  public readonly type: HelpdeskErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: HelpdeskErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'HelpdeskError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HelpdeskError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns HelpdeskError instance
   */
  static fromError(error: any): HelpdeskError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: HelpdeskErrorType; retryable: boolean }> = {
      '401': { type: HelpdeskErrorType.Authentication, retryable: false },
      '429': { type: HelpdeskErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new HelpdeskError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = HelpdeskErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = HelpdeskErrorType.Authentication
    } else if (statusCode === 403) {
      type = HelpdeskErrorType.Authorization
    } else if (statusCode === 404) {
      type = HelpdeskErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = HelpdeskErrorType.Validation
    } else if (statusCode === 429) {
      type = HelpdeskErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = HelpdeskErrorType.Server
      retryable = true
    }

    return new HelpdeskError(message, code, type, {
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
    return this.type === HelpdeskErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === HelpdeskErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === HelpdeskErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === HelpdeskErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === HelpdeskErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === HelpdeskErrorType.Server
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

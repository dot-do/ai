/**
 * Intercom Errors
 *
 * Auto-generated error handling for Intercom Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/intercom
 */

/**
 * Error type enum
 */
export enum IntercomErrorType {
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
 * Intercom Error class
 *
 * Custom error class for Intercom Integration operations.
 */
export class IntercomError extends Error {
  public readonly code: string | number
  public readonly type: IntercomErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: IntercomErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'IntercomError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IntercomError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns IntercomError instance
   */
  static fromError(error: any): IntercomError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: IntercomErrorType; retryable: boolean }> = {
      unauthorized: { type: IntercomErrorType.Authentication, retryable: false },
      forbidden: { type: IntercomErrorType.Authorization, retryable: false },
      not_found: { type: IntercomErrorType.NotFound, retryable: false },
      rate_limit_exceeded: { type: IntercomErrorType.RateLimit, retryable: true },
      service_unavailable: { type: IntercomErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new IntercomError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = IntercomErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = IntercomErrorType.Authentication
    } else if (statusCode === 403) {
      type = IntercomErrorType.Authorization
    } else if (statusCode === 404) {
      type = IntercomErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = IntercomErrorType.Validation
    } else if (statusCode === 429) {
      type = IntercomErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = IntercomErrorType.Server
      retryable = true
    }

    return new IntercomError(message, code, type, {
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
    return this.type === IntercomErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === IntercomErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === IntercomErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === IntercomErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === IntercomErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === IntercomErrorType.Server
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

/**
 * Deadline funnel Errors
 *
 * Auto-generated error handling for Deadline funnel Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/deadline_funnel
 */

/**
 * Error type enum
 */
export enum DeadlineFunnelErrorType {
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
 * Deadline funnel Error class
 *
 * Custom error class for Deadline funnel Integration operations.
 */
export class DeadlineFunnelError extends Error {
  public readonly code: string | number
  public readonly type: DeadlineFunnelErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DeadlineFunnelErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DeadlineFunnelError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DeadlineFunnelError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DeadlineFunnelError instance
   */
  static fromError(error: any): DeadlineFunnelError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DeadlineFunnelErrorType; retryable: boolean }> = {
      '401': { type: DeadlineFunnelErrorType.Authentication, retryable: false },
      '429': { type: DeadlineFunnelErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DeadlineFunnelError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DeadlineFunnelErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DeadlineFunnelErrorType.Authentication
    } else if (statusCode === 403) {
      type = DeadlineFunnelErrorType.Authorization
    } else if (statusCode === 404) {
      type = DeadlineFunnelErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DeadlineFunnelErrorType.Validation
    } else if (statusCode === 429) {
      type = DeadlineFunnelErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DeadlineFunnelErrorType.Server
      retryable = true
    }

    return new DeadlineFunnelError(message, code, type, {
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
    return this.type === DeadlineFunnelErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DeadlineFunnelErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DeadlineFunnelErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DeadlineFunnelErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DeadlineFunnelErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DeadlineFunnelErrorType.Server
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

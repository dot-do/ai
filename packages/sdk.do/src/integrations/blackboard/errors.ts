/**
 * Blackboard Errors
 *
 * Auto-generated error handling for Blackboard Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/blackboard
 */

/**
 * Error type enum
 */
export enum BlackboardErrorType {
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
 * Blackboard Error class
 *
 * Custom error class for Blackboard Integration operations.
 */
export class BlackboardError extends Error {
  public readonly code: string | number
  public readonly type: BlackboardErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BlackboardErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BlackboardError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BlackboardError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BlackboardError instance
   */
  static fromError(error: any): BlackboardError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BlackboardErrorType; retryable: boolean }> = {
      '401': { type: BlackboardErrorType.Authentication, retryable: false },
      '429': { type: BlackboardErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BlackboardError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BlackboardErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BlackboardErrorType.Authentication
    } else if (statusCode === 403) {
      type = BlackboardErrorType.Authorization
    } else if (statusCode === 404) {
      type = BlackboardErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BlackboardErrorType.Validation
    } else if (statusCode === 429) {
      type = BlackboardErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BlackboardErrorType.Server
      retryable = true
    }

    return new BlackboardError(message, code, type, {
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
    return this.type === BlackboardErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BlackboardErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BlackboardErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BlackboardErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BlackboardErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BlackboardErrorType.Server
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

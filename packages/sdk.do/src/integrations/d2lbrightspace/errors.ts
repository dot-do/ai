/**
 * D2lbrightspace Errors
 *
 * Auto-generated error handling for D2lbrightspace Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/d2lbrightspace
 */

/**
 * Error type enum
 */
export enum D2lbrightspaceErrorType {
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
 * D2lbrightspace Error class
 *
 * Custom error class for D2lbrightspace Integration operations.
 */
export class D2lbrightspaceError extends Error {
  public readonly code: string | number
  public readonly type: D2lbrightspaceErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: D2lbrightspaceErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'D2lbrightspaceError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, D2lbrightspaceError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns D2lbrightspaceError instance
   */
  static fromError(error: any): D2lbrightspaceError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: D2lbrightspaceErrorType; retryable: boolean }> = {
      '401': { type: D2lbrightspaceErrorType.Authentication, retryable: false },
      '429': { type: D2lbrightspaceErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new D2lbrightspaceError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = D2lbrightspaceErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = D2lbrightspaceErrorType.Authentication
    } else if (statusCode === 403) {
      type = D2lbrightspaceErrorType.Authorization
    } else if (statusCode === 404) {
      type = D2lbrightspaceErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = D2lbrightspaceErrorType.Validation
    } else if (statusCode === 429) {
      type = D2lbrightspaceErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = D2lbrightspaceErrorType.Server
      retryable = true
    }

    return new D2lbrightspaceError(message, code, type, {
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
    return this.type === D2lbrightspaceErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === D2lbrightspaceErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === D2lbrightspaceErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === D2lbrightspaceErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === D2lbrightspaceErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === D2lbrightspaceErrorType.Server
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

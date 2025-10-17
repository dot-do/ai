/**
 * Microsoft Teams Errors
 *
 * Auto-generated error handling for Microsoft Teams Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/teams
 */

/**
 * Error type enum
 */
export enum TeamsErrorType {
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
 * Microsoft Teams Error class
 *
 * Custom error class for Microsoft Teams Integration operations.
 */
export class TeamsError extends Error {
  public readonly code: string | number
  public readonly type: TeamsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TeamsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TeamsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TeamsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TeamsError instance
   */
  static fromError(error: any): TeamsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TeamsErrorType; retryable: boolean }> = {
      InvalidAuthenticationToken: { type: TeamsErrorType.Authentication, retryable: false },
      Unauthorized: { type: TeamsErrorType.Authentication, retryable: false },
      Forbidden: { type: TeamsErrorType.Authorization, retryable: false },
      NotFound: { type: TeamsErrorType.NotFound, retryable: false },
      TooManyRequests: { type: TeamsErrorType.RateLimit, retryable: true },
      ServiceUnavailable: { type: TeamsErrorType.Server, retryable: true },
      GatewayTimeout: { type: TeamsErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TeamsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TeamsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TeamsErrorType.Authentication
    } else if (statusCode === 403) {
      type = TeamsErrorType.Authorization
    } else if (statusCode === 404) {
      type = TeamsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TeamsErrorType.Validation
    } else if (statusCode === 429) {
      type = TeamsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TeamsErrorType.Server
      retryable = true
    }

    return new TeamsError(message, code, type, {
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
    return this.type === TeamsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TeamsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TeamsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TeamsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TeamsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TeamsErrorType.Server
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

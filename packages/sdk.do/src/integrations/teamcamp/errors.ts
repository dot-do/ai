/**
 * Teamcamp Errors
 *
 * Auto-generated error handling for Teamcamp Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/teamcamp
 */

/**
 * Error type enum
 */
export enum TeamcampErrorType {
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
 * Teamcamp Error class
 *
 * Custom error class for Teamcamp Integration operations.
 */
export class TeamcampError extends Error {
  public readonly code: string | number
  public readonly type: TeamcampErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TeamcampErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TeamcampError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TeamcampError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TeamcampError instance
   */
  static fromError(error: any): TeamcampError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TeamcampErrorType; retryable: boolean }> = {
      '401': { type: TeamcampErrorType.Authentication, retryable: false },
      '429': { type: TeamcampErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TeamcampError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TeamcampErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TeamcampErrorType.Authentication
    } else if (statusCode === 403) {
      type = TeamcampErrorType.Authorization
    } else if (statusCode === 404) {
      type = TeamcampErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TeamcampErrorType.Validation
    } else if (statusCode === 429) {
      type = TeamcampErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TeamcampErrorType.Server
      retryable = true
    }

    return new TeamcampError(message, code, type, {
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
    return this.type === TeamcampErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TeamcampErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TeamcampErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TeamcampErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TeamcampErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TeamcampErrorType.Server
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

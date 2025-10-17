/**
 * Idea scale Errors
 *
 * Auto-generated error handling for Idea scale Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/idea_scale
 */

/**
 * Error type enum
 */
export enum IdeaScaleErrorType {
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
 * Idea scale Error class
 *
 * Custom error class for Idea scale Integration operations.
 */
export class IdeaScaleError extends Error {
  public readonly code: string | number
  public readonly type: IdeaScaleErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: IdeaScaleErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'IdeaScaleError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IdeaScaleError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns IdeaScaleError instance
   */
  static fromError(error: any): IdeaScaleError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: IdeaScaleErrorType; retryable: boolean }> = {
      '401': { type: IdeaScaleErrorType.Authentication, retryable: false },
      '429': { type: IdeaScaleErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new IdeaScaleError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = IdeaScaleErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = IdeaScaleErrorType.Authentication
    } else if (statusCode === 403) {
      type = IdeaScaleErrorType.Authorization
    } else if (statusCode === 404) {
      type = IdeaScaleErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = IdeaScaleErrorType.Validation
    } else if (statusCode === 429) {
      type = IdeaScaleErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = IdeaScaleErrorType.Server
      retryable = true
    }

    return new IdeaScaleError(message, code, type, {
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
    return this.type === IdeaScaleErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === IdeaScaleErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === IdeaScaleErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === IdeaScaleErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === IdeaScaleErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === IdeaScaleErrorType.Server
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

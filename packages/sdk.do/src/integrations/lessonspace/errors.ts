/**
 * Lessonspace Errors
 *
 * Auto-generated error handling for Lessonspace Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/lessonspace
 */

/**
 * Error type enum
 */
export enum LessonspaceErrorType {
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
 * Lessonspace Error class
 *
 * Custom error class for Lessonspace Integration operations.
 */
export class LessonspaceError extends Error {
  public readonly code: string | number
  public readonly type: LessonspaceErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LessonspaceErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LessonspaceError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LessonspaceError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LessonspaceError instance
   */
  static fromError(error: any): LessonspaceError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LessonspaceErrorType; retryable: boolean }> = {
      '401': { type: LessonspaceErrorType.Authentication, retryable: false },
      '429': { type: LessonspaceErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LessonspaceError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LessonspaceErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LessonspaceErrorType.Authentication
    } else if (statusCode === 403) {
      type = LessonspaceErrorType.Authorization
    } else if (statusCode === 404) {
      type = LessonspaceErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LessonspaceErrorType.Validation
    } else if (statusCode === 429) {
      type = LessonspaceErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LessonspaceErrorType.Server
      retryable = true
    }

    return new LessonspaceError(message, code, type, {
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
    return this.type === LessonspaceErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LessonspaceErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LessonspaceErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LessonspaceErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LessonspaceErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LessonspaceErrorType.Server
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

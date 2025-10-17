/**
 * Recruitee Errors
 *
 * Auto-generated error handling for Recruitee Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/recruitee
 */

/**
 * Error type enum
 */
export enum RecruiteeErrorType {
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
 * Recruitee Error class
 *
 * Custom error class for Recruitee Integration operations.
 */
export class RecruiteeError extends Error {
  public readonly code: string | number
  public readonly type: RecruiteeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RecruiteeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RecruiteeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RecruiteeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RecruiteeError instance
   */
  static fromError(error: any): RecruiteeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RecruiteeErrorType; retryable: boolean }> = {
      '401': { type: RecruiteeErrorType.Authentication, retryable: false },
      '429': { type: RecruiteeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RecruiteeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RecruiteeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RecruiteeErrorType.Authentication
    } else if (statusCode === 403) {
      type = RecruiteeErrorType.Authorization
    } else if (statusCode === 404) {
      type = RecruiteeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RecruiteeErrorType.Validation
    } else if (statusCode === 429) {
      type = RecruiteeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RecruiteeErrorType.Server
      retryable = true
    }

    return new RecruiteeError(message, code, type, {
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
    return this.type === RecruiteeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RecruiteeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RecruiteeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RecruiteeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RecruiteeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RecruiteeErrorType.Server
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

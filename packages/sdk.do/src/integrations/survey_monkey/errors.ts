/**
 * Survey monkey Errors
 *
 * Auto-generated error handling for Survey monkey Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/survey_monkey
 */

/**
 * Error type enum
 */
export enum SurveyMonkeyErrorType {
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
 * Survey monkey Error class
 *
 * Custom error class for Survey monkey Integration operations.
 */
export class SurveyMonkeyError extends Error {
  public readonly code: string | number
  public readonly type: SurveyMonkeyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SurveyMonkeyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SurveyMonkeyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SurveyMonkeyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SurveyMonkeyError instance
   */
  static fromError(error: any): SurveyMonkeyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SurveyMonkeyErrorType; retryable: boolean }> = {
      '401': { type: SurveyMonkeyErrorType.Authentication, retryable: false },
      '429': { type: SurveyMonkeyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SurveyMonkeyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SurveyMonkeyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SurveyMonkeyErrorType.Authentication
    } else if (statusCode === 403) {
      type = SurveyMonkeyErrorType.Authorization
    } else if (statusCode === 404) {
      type = SurveyMonkeyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SurveyMonkeyErrorType.Validation
    } else if (statusCode === 429) {
      type = SurveyMonkeyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SurveyMonkeyErrorType.Server
      retryable = true
    }

    return new SurveyMonkeyError(message, code, type, {
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
    return this.type === SurveyMonkeyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SurveyMonkeyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SurveyMonkeyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SurveyMonkeyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SurveyMonkeyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SurveyMonkeyErrorType.Server
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

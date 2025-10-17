/**
 * SurveyMonkey Errors
 *
 * Auto-generated error handling for SurveyMonkey Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/surveymonkey
 */

/**
 * Error type enum
 */
export enum SurveymonkeyErrorType {
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
 * SurveyMonkey Error class
 *
 * Custom error class for SurveyMonkey Integration operations.
 */
export class SurveymonkeyError extends Error {
  public readonly code: string | number
  public readonly type: SurveymonkeyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SurveymonkeyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SurveymonkeyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SurveymonkeyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SurveymonkeyError instance
   */
  static fromError(error: any): SurveymonkeyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SurveymonkeyErrorType; retryable: boolean }> = {
      '401': { type: SurveymonkeyErrorType.Authentication, retryable: false },
      '429': { type: SurveymonkeyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SurveymonkeyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SurveymonkeyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SurveymonkeyErrorType.Authentication
    } else if (statusCode === 403) {
      type = SurveymonkeyErrorType.Authorization
    } else if (statusCode === 404) {
      type = SurveymonkeyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SurveymonkeyErrorType.Validation
    } else if (statusCode === 429) {
      type = SurveymonkeyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SurveymonkeyErrorType.Server
      retryable = true
    }

    return new SurveymonkeyError(message, code, type, {
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
    return this.type === SurveymonkeyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SurveymonkeyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SurveymonkeyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SurveymonkeyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SurveymonkeyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SurveymonkeyErrorType.Server
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

/**
 * Smartrecruiters Errors
 *
 * Auto-generated error handling for Smartrecruiters Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/smartrecruiters
 */

/**
 * Error type enum
 */
export enum SmartrecruitersErrorType {
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
 * Smartrecruiters Error class
 *
 * Custom error class for Smartrecruiters Integration operations.
 */
export class SmartrecruitersError extends Error {
  public readonly code: string | number
  public readonly type: SmartrecruitersErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SmartrecruitersErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SmartrecruitersError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SmartrecruitersError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SmartrecruitersError instance
   */
  static fromError(error: any): SmartrecruitersError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SmartrecruitersErrorType; retryable: boolean }> = {
      '401': { type: SmartrecruitersErrorType.Authentication, retryable: false },
      '429': { type: SmartrecruitersErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SmartrecruitersError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SmartrecruitersErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SmartrecruitersErrorType.Authentication
    } else if (statusCode === 403) {
      type = SmartrecruitersErrorType.Authorization
    } else if (statusCode === 404) {
      type = SmartrecruitersErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SmartrecruitersErrorType.Validation
    } else if (statusCode === 429) {
      type = SmartrecruitersErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SmartrecruitersErrorType.Server
      retryable = true
    }

    return new SmartrecruitersError(message, code, type, {
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
    return this.type === SmartrecruitersErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SmartrecruitersErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SmartrecruitersErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SmartrecruitersErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SmartrecruitersErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SmartrecruitersErrorType.Server
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

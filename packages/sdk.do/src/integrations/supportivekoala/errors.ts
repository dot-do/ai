/**
 * Supportivekoala Errors
 *
 * Auto-generated error handling for Supportivekoala Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/supportivekoala
 */

/**
 * Error type enum
 */
export enum SupportivekoalaErrorType {
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
 * Supportivekoala Error class
 *
 * Custom error class for Supportivekoala Integration operations.
 */
export class SupportivekoalaError extends Error {
  public readonly code: string | number
  public readonly type: SupportivekoalaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SupportivekoalaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SupportivekoalaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SupportivekoalaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SupportivekoalaError instance
   */
  static fromError(error: any): SupportivekoalaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SupportivekoalaErrorType; retryable: boolean }> = {
      '401': { type: SupportivekoalaErrorType.Authentication, retryable: false },
      '429': { type: SupportivekoalaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SupportivekoalaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SupportivekoalaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SupportivekoalaErrorType.Authentication
    } else if (statusCode === 403) {
      type = SupportivekoalaErrorType.Authorization
    } else if (statusCode === 404) {
      type = SupportivekoalaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SupportivekoalaErrorType.Validation
    } else if (statusCode === 429) {
      type = SupportivekoalaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SupportivekoalaErrorType.Server
      retryable = true
    }

    return new SupportivekoalaError(message, code, type, {
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
    return this.type === SupportivekoalaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SupportivekoalaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SupportivekoalaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SupportivekoalaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SupportivekoalaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SupportivekoalaErrorType.Server
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

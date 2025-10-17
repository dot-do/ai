/**
 * Autom Errors
 *
 * Auto-generated error handling for Autom Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/autom
 */

/**
 * Error type enum
 */
export enum AutomErrorType {
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
 * Autom Error class
 *
 * Custom error class for Autom Integration operations.
 */
export class AutomError extends Error {
  public readonly code: string | number
  public readonly type: AutomErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AutomErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AutomError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AutomError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AutomError instance
   */
  static fromError(error: any): AutomError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AutomErrorType; retryable: boolean }> = {
      '401': { type: AutomErrorType.Authentication, retryable: false },
      '429': { type: AutomErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AutomError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AutomErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AutomErrorType.Authentication
    } else if (statusCode === 403) {
      type = AutomErrorType.Authorization
    } else if (statusCode === 404) {
      type = AutomErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AutomErrorType.Validation
    } else if (statusCode === 429) {
      type = AutomErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AutomErrorType.Server
      retryable = true
    }

    return new AutomError(message, code, type, {
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
    return this.type === AutomErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AutomErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AutomErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AutomErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AutomErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AutomErrorType.Server
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

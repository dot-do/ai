/**
 * Rkvst Errors
 *
 * Auto-generated error handling for Rkvst Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/rkvst
 */

/**
 * Error type enum
 */
export enum RkvstErrorType {
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
 * Rkvst Error class
 *
 * Custom error class for Rkvst Integration operations.
 */
export class RkvstError extends Error {
  public readonly code: string | number
  public readonly type: RkvstErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RkvstErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RkvstError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RkvstError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RkvstError instance
   */
  static fromError(error: any): RkvstError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RkvstErrorType; retryable: boolean }> = {
      '401': { type: RkvstErrorType.Authentication, retryable: false },
      '429': { type: RkvstErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RkvstError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RkvstErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RkvstErrorType.Authentication
    } else if (statusCode === 403) {
      type = RkvstErrorType.Authorization
    } else if (statusCode === 404) {
      type = RkvstErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RkvstErrorType.Validation
    } else if (statusCode === 429) {
      type = RkvstErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RkvstErrorType.Server
      retryable = true
    }

    return new RkvstError(message, code, type, {
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
    return this.type === RkvstErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RkvstErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RkvstErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RkvstErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RkvstErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RkvstErrorType.Server
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

/**
 * Enginemailer Errors
 *
 * Auto-generated error handling for Enginemailer Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/enginemailer
 */

/**
 * Error type enum
 */
export enum EnginemailerErrorType {
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
 * Enginemailer Error class
 *
 * Custom error class for Enginemailer Integration operations.
 */
export class EnginemailerError extends Error {
  public readonly code: string | number
  public readonly type: EnginemailerErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: EnginemailerErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'EnginemailerError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EnginemailerError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns EnginemailerError instance
   */
  static fromError(error: any): EnginemailerError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: EnginemailerErrorType; retryable: boolean }> = {
      '401': { type: EnginemailerErrorType.Authentication, retryable: false },
      '429': { type: EnginemailerErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new EnginemailerError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = EnginemailerErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = EnginemailerErrorType.Authentication
    } else if (statusCode === 403) {
      type = EnginemailerErrorType.Authorization
    } else if (statusCode === 404) {
      type = EnginemailerErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = EnginemailerErrorType.Validation
    } else if (statusCode === 429) {
      type = EnginemailerErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = EnginemailerErrorType.Server
      retryable = true
    }

    return new EnginemailerError(message, code, type, {
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
    return this.type === EnginemailerErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === EnginemailerErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === EnginemailerErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === EnginemailerErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === EnginemailerErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === EnginemailerErrorType.Server
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

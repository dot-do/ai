/**
 * Lexoffice Errors
 *
 * Auto-generated error handling for Lexoffice Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/lexoffice
 */

/**
 * Error type enum
 */
export enum LexofficeErrorType {
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
 * Lexoffice Error class
 *
 * Custom error class for Lexoffice Integration operations.
 */
export class LexofficeError extends Error {
  public readonly code: string | number
  public readonly type: LexofficeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LexofficeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LexofficeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LexofficeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LexofficeError instance
   */
  static fromError(error: any): LexofficeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LexofficeErrorType; retryable: boolean }> = {
      '401': { type: LexofficeErrorType.Authentication, retryable: false },
      '429': { type: LexofficeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LexofficeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LexofficeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LexofficeErrorType.Authentication
    } else if (statusCode === 403) {
      type = LexofficeErrorType.Authorization
    } else if (statusCode === 404) {
      type = LexofficeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LexofficeErrorType.Validation
    } else if (statusCode === 429) {
      type = LexofficeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LexofficeErrorType.Server
      retryable = true
    }

    return new LexofficeError(message, code, type, {
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
    return this.type === LexofficeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LexofficeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LexofficeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LexofficeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LexofficeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LexofficeErrorType.Server
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

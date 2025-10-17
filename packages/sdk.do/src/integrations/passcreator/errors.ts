/**
 * Passcreator Errors
 *
 * Auto-generated error handling for Passcreator Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/passcreator
 */

/**
 * Error type enum
 */
export enum PasscreatorErrorType {
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
 * Passcreator Error class
 *
 * Custom error class for Passcreator Integration operations.
 */
export class PasscreatorError extends Error {
  public readonly code: string | number
  public readonly type: PasscreatorErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PasscreatorErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PasscreatorError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PasscreatorError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PasscreatorError instance
   */
  static fromError(error: any): PasscreatorError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PasscreatorErrorType; retryable: boolean }> = {
      '401': { type: PasscreatorErrorType.Authentication, retryable: false },
      '429': { type: PasscreatorErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PasscreatorError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PasscreatorErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PasscreatorErrorType.Authentication
    } else if (statusCode === 403) {
      type = PasscreatorErrorType.Authorization
    } else if (statusCode === 404) {
      type = PasscreatorErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PasscreatorErrorType.Validation
    } else if (statusCode === 429) {
      type = PasscreatorErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PasscreatorErrorType.Server
      retryable = true
    }

    return new PasscreatorError(message, code, type, {
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
    return this.type === PasscreatorErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PasscreatorErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PasscreatorErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PasscreatorErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PasscreatorErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PasscreatorErrorType.Server
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

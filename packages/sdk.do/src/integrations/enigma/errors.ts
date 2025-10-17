/**
 * Enigma Errors
 *
 * Auto-generated error handling for Enigma Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/enigma
 */

/**
 * Error type enum
 */
export enum EnigmaErrorType {
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
 * Enigma Error class
 *
 * Custom error class for Enigma Integration operations.
 */
export class EnigmaError extends Error {
  public readonly code: string | number
  public readonly type: EnigmaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: EnigmaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'EnigmaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EnigmaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns EnigmaError instance
   */
  static fromError(error: any): EnigmaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: EnigmaErrorType; retryable: boolean }> = {
      '401': { type: EnigmaErrorType.Authentication, retryable: false },
      '429': { type: EnigmaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new EnigmaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = EnigmaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = EnigmaErrorType.Authentication
    } else if (statusCode === 403) {
      type = EnigmaErrorType.Authorization
    } else if (statusCode === 404) {
      type = EnigmaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = EnigmaErrorType.Validation
    } else if (statusCode === 429) {
      type = EnigmaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = EnigmaErrorType.Server
      retryable = true
    }

    return new EnigmaError(message, code, type, {
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
    return this.type === EnigmaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === EnigmaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === EnigmaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === EnigmaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === EnigmaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === EnigmaErrorType.Server
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

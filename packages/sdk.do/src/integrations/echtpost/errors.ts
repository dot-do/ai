/**
 * Echtpost Errors
 *
 * Auto-generated error handling for Echtpost Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/echtpost
 */

/**
 * Error type enum
 */
export enum EchtpostErrorType {
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
 * Echtpost Error class
 *
 * Custom error class for Echtpost Integration operations.
 */
export class EchtpostError extends Error {
  public readonly code: string | number
  public readonly type: EchtpostErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: EchtpostErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'EchtpostError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EchtpostError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns EchtpostError instance
   */
  static fromError(error: any): EchtpostError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: EchtpostErrorType; retryable: boolean }> = {
      '401': { type: EchtpostErrorType.Authentication, retryable: false },
      '429': { type: EchtpostErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new EchtpostError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = EchtpostErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = EchtpostErrorType.Authentication
    } else if (statusCode === 403) {
      type = EchtpostErrorType.Authorization
    } else if (statusCode === 404) {
      type = EchtpostErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = EchtpostErrorType.Validation
    } else if (statusCode === 429) {
      type = EchtpostErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = EchtpostErrorType.Server
      retryable = true
    }

    return new EchtpostError(message, code, type, {
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
    return this.type === EchtpostErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === EchtpostErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === EchtpostErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === EchtpostErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === EchtpostErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === EchtpostErrorType.Server
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
